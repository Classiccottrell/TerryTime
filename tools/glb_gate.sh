#!/usr/bin/env bash
# glb_gate.sh — GLB web-budget gate for Agentic Forge.
#
# INVOCATION CONTRACT (verified against pipeline/run.sh, custom-gate branch):
#   ( cd "$cwd_p" && "$script_p" "${fields[@]:3}" )
# so cwd is ALREADY inside the target repo, and the repo path is NOT passed as
# $1 the way the built-in gates receive it. Args are the two paths below.
# run.sh also refuses to run this if it is a symlink, so it must be a real
# file committed inside the target repo (canonical copy lives in the Forge at
# pipeline/lib/glb_gate.sh).
#
# Checks every .glb under <glb-dir> against <budget-json>:
#   - glTF spec validity    (gltf-transform validate; exits 1 on spec errors —
#                            verified 2026-09-24 against truncated/garbage GLBs)
#   - file size             (python3 stdlib)
#   - triangle count        (python3 stdlib: GLB container + JSON chunk)
#   - max texture dimension (python3 stdlib: PNG IHDR / JPEG SOFn headers)
#   - forbidden extensions  (extensionsUsed; KHR_materials_sheen by default —
#                            sheen renders near-black fabric grey in three.js)
#   - sidecar freshness      (when <name>.budget.json exists, its measured
#                            fields must match the GLB being shipped)
#
# Missing dir / no .glb / no budget file -> WARN and skip, matching the
# built-in gates' convention. Present-but-over-budget -> hard fail.
# Never installs anything: without node the four budget checks still run and
# only the spec check is skipped.
#
# Optional max_bytes_overrides keys are paths relative to <glb-dir>. Keep
# existing assets at their measured ceiling without relaxing new-asset budgets.
# Usage: glb_gate.sh [glb-dir] [budget-json]
set -euo pipefail

GLB_DIR="${1:-${GLB_GATE_DIR:-public/models}}"
BUDGET="${2:-${GLB_BUDGET_PATH:-glb-budget.json}}"

if [ ! -d "$GLB_DIR" ]; then
  echo "[glb_gate] WARN — no GLB directory at $GLB_DIR (override with arg 1 or GLB_GATE_DIR). Skipping."
  exit 0
fi

LIST="$(mktemp "${TMPDIR:-/tmp}/glb_gate.XXXXXX")"
trap 'rm -f "$LIST"' EXIT
find "$GLB_DIR" -type f -name '*.glb' | sort > "$LIST"

if [ ! -s "$LIST" ]; then
  echo "[glb_gate] WARN — no .glb files under $GLB_DIR; nothing to check. Skipping."
  exit 0
fi

if [ ! -f "$BUDGET" ]; then
  echo "[glb_gate] WARN — .glb files found under $GLB_DIR but no budget file at $BUDGET (override with arg 2 or GLB_BUDGET_PATH). Skipping."
  exit 0
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "[glb_gate] FAIL — .glb files present but python3 is not available to check them against $BUDGET."
  exit 1
fi

# --- spec validation --------------------------------------------------------
# Resolved once up front so "not installed" is distinguishable from a real
# validation failure. npx --no-install never fetches anything.
GT=""
if command -v gltf-transform >/dev/null 2>&1; then
  GT="gltf-transform"
elif command -v npx >/dev/null 2>&1 && npx --no-install @gltf-transform/cli --version >/dev/null 2>&1; then
  GT="npx --no-install @gltf-transform/cli"
fi

SPEC_RC=0
if [ -n "$GT" ]; then
  echo "[glb_gate] spec validation via: $GT"
  while IFS= read -r GLB; do
    [ -n "$GLB" ] || continue
    if $GT validate "$GLB" >/dev/null 2>&1; then
      echo "[glb_gate]   spec OK   $GLB"
    else
      echo "[glb_gate]   spec FAIL $GLB"
      SPEC_RC=1
    fi
  done < "$LIST"
else
  echo "[glb_gate] WARN — gltf-transform not installed; skipping the glTF spec-validation check."
  echo "[glb_gate]   Budget checks below still run (python3 stdlib only)."
fi

# --- budget checks ----------------------------------------------------------
BUDGET_RC=0
python3 - "$BUDGET" "$LIST" "$GLB_DIR" <<'PYEOF' || BUDGET_RC=1
import json, os, struct, sys

budget_path, list_path, glb_dir = sys.argv[1:4]
FAILURES = []

try:
    with open(budget_path) as f:
        budget = json.load(f)
except Exception as e:
    print("[glb_gate] FAIL - %s is not valid JSON: %s" % (budget_path, e))
    sys.exit(1)

max_bytes     = budget.get("max_bytes", 3 * 1024 * 1024)
max_triangles = budget.get("max_triangles", 150000)
max_tex_px    = budget.get("max_texture_px", 2048)
forbidden     = budget.get("forbidden_extensions", ["KHR_materials_sheen"])
byte_overrides = budget.get("max_bytes_overrides", {})
if not isinstance(byte_overrides, dict) or any(
    not isinstance(path, str) or path.startswith("/") or ".." in path.split("/")
    or not isinstance(limit, int) or isinstance(limit, bool) or limit < 1
    for path, limit in byte_overrides.items()
):
    print("[glb_gate] FAIL - max_bytes_overrides must map relative file paths to positive integer byte limits")
    sys.exit(1)


def parse_glb(path):
    """(gltf_json, bin_chunk) from a GLB 2.0 container. Stdlib only."""
    with open(path, "rb") as f:
        data = f.read()
    if len(data) < 12 or data[0:4] != b"glTF":
        raise ValueError("not a GLB container (missing 'glTF' magic)")
    ver = struct.unpack_from("<I", data, 4)[0]
    if ver != 2:
        raise ValueError("unsupported GLB version %d (expected 2)" % ver)
    off, gltf, binc = 12, None, b""
    while off + 8 <= len(data):
        clen, ctype = struct.unpack_from("<II", data, off)
        body = data[off + 8: off + 8 + clen]
        if ctype == 0x4E4F534A:      # 'JSON'
            gltf = json.loads(body.decode("utf-8"))
        elif ctype == 0x004E4942:    # 'BIN'
            binc = body
        off += 8 + clen + ((4 - clen % 4) % 4)
    if gltf is None:
        raise ValueError("GLB has no JSON chunk")
    return gltf, binc


def triangles(gltf):
    """Triangles as DEFINED by the meshes. A mesh reused by 10 nodes counts
    once - the budget is about payload complexity, not draw cost."""
    total, acc = 0, gltf.get("accessors", [])
    for mesh in gltf.get("meshes", []):
        for prim in mesh.get("primitives", []):
            if prim.get("mode", 4) != 4:   # TRIANGLES only
                continue
            if "indices" in prim:
                total += acc[prim["indices"]].get("count", 0) // 3
            else:
                pos = prim.get("attributes", {}).get("POSITION")
                if pos is not None:
                    total += acc[pos].get("count", 0) // 3
    return total


def image_dims(blob):
    """(w, h) from a PNG or JPEG header, else None."""
    if blob[:8] == b"\x89PNG\r\n\x1a\n" and blob[12:16] == b"IHDR":
        return struct.unpack_from(">II", blob, 16)
    if blob[:2] == b"\xff\xd8":
        i = 2
        while i + 9 < len(blob):
            if blob[i] != 0xFF:
                i += 1
                continue
            marker = blob[i + 1]
            seglen = struct.unpack_from(">H", blob, i + 2)[0]
            if marker in (0xC0, 0xC1, 0xC2, 0xC3, 0xC5, 0xC6, 0xC7,
                          0xC9, 0xCA, 0xCB, 0xCD, 0xCE, 0xCF):
                h, w = struct.unpack_from(">HH", blob, i + 5)
                return (w, h)
            i += 2 + seglen
    return None


def max_texture(gltf, binc):
    """Largest texture dimension, plus a count of images whose dimensions
    could not be read (external URIs, or KTX2/basis containers) - counted as
    unknown rather than silently treated as 0."""
    biggest, unknown = 0, 0
    views = gltf.get("bufferViews", [])
    for img in gltf.get("images", []):
        blob = b""
        if "bufferView" in img:
            bv = views[img["bufferView"]]
            start = bv.get("byteOffset", 0)
            blob = binc[start: start + bv.get("byteLength", 0)]
        elif "uri" in img and not img["uri"].startswith("data:"):
            unknown += 1
            continue
        dims = image_dims(blob[:4096])
        if dims is None:
            unknown += 1
            continue
        biggest = max(biggest, dims[0], dims[1])
    return biggest, unknown


with open(list_path) as f:
    paths = [line.strip() for line in f if line.strip()]

for path in paths:
    size = os.path.getsize(path)
    relative_path = os.path.relpath(path, glb_dir).replace(os.sep, "/")
    byte_limit = byte_overrides.get(relative_path, max_bytes)
    try:
        gltf, binc = parse_glb(path)
    except Exception as e:
        FAILURES.append("%s: cannot parse as GLB: %s" % (path, e))
        continue

    if size > byte_limit:
        FAILURES.append("%s: %d bytes over max_bytes %d (%.2f MB vs %.2f MB)"
                        % (path, size, byte_limit, size / 1048576.0, byte_limit / 1048576.0))

    tris = triangles(gltf)
    if tris > max_triangles:
        FAILURES.append("%s: %d triangles over max_triangles %d" % (path, tris, max_triangles))

    tex, unknown = max_texture(gltf, binc)
    if tex > max_tex_px:
        FAILURES.append("%s: largest texture %dpx over max_texture_px %d" % (path, tex, max_tex_px))

    used = set(gltf.get("extensionsUsed", [])) | set(gltf.get("extensionsRequired", []))
    for ext in forbidden:
        if ext in used:
            FAILURES.append("%s: forbidden extension %s present" % (path, ext))

    sidecar_path = os.path.splitext(path)[0] + ".budget.json"
    if os.path.isfile(sidecar_path):
        try:
            with open(sidecar_path) as sidecar_file:
                sidecar = json.load(sidecar_file)
            measured = {
                "bytes": size,
                "triangles": tris,
                "meshes": len(gltf.get("meshes", [])),
                "materials": len(gltf.get("materials", [])),
                "max_texture_px": tex,
                "extensions": sorted(used),
            }
            for field, actual in measured.items():
                if sidecar.get(field) != actual:
                    FAILURES.append("%s: sidecar %s is %r, measured %r"
                                    % (sidecar_path, field, sidecar.get(field), actual))
        except Exception as e:
            FAILURES.append("%s: cannot read sidecar: %s" % (sidecar_path, e))

    note = "" if not unknown else "  (%d image(s) external or non-PNG/JPEG - dimensions unverified)" % unknown
    limit_note = " (byte limit %d)" % byte_limit if relative_path in byte_overrides else ""
    print("[glb_gate]   %s: %.2f MB, %d tris, max texture %dpx, ext=%s%s%s"
          % (path, size / 1048576.0, tris, tex, sorted(used) or "none", limit_note, note))

if FAILURES:
    for msg in FAILURES:
        print("[glb_gate] FAIL - %s" % msg)
    sys.exit(1)

print("[glb_gate] budget OK for %d file(s): max_bytes=%d max_triangles=%d max_texture_px=%d forbidden=%s"
      % (len(paths), max_bytes, max_triangles, max_tex_px, forbidden))
PYEOF

if [ "$SPEC_RC" -ne 0 ] || [ "$BUDGET_RC" -ne 0 ]; then
  echo "[glb_gate] FAIL — see output above (spec=$SPEC_RC budget=$BUDGET_RC)"
  exit 1
fi

COUNT="$(wc -l < "$LIST" | tr -d ' ')"
echo "[glb_gate] PASS — $COUNT .glb file(s) clear $BUDGET"
echo "[glb_gate]   (a passing budget is not a visual sign-off — the Three.js viewer check still applies)"
exit 0
