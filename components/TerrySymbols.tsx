"use client";

import { useEffect, useRef } from "react";

/**
 * Terry set in type: the footer / error-page graphic.
 *
 * A grid of monospace symbols reads the Terry face drawing cell by cell: outlines
 * take a glyph that follows the stroke (| / \ -), solid strokes take heavy glyphs,
 * the background prints faint engraving rows. Every cell keeps re-picking its glyph
 * within its weight class, so the type never stops switching while the face stays
 * legible. A stable-fluids simulation runs underneath: a fast flick smears the type
 * and scrambles it in a red second plate (print misregistration), then it settles.
 * On first view the face prints top to bottom like a receipt printer.
 *
 * WebGL2 (+ float render targets). Without it, a static typed frame is drawn with
 * canvas 2D. Under prefers-reduced-motion a single still frame is rendered.
 * Decorative only: aria-hidden, pauses when off-screen.
 *
 * Explorations that lost out (wet ink, loose thread, relief, other glyph sets and
 * sizes) are on the `archive/unused-stores` branch in archive/footer-graphics/.
 */
type Placement = { faceX?: number; faceY?: number; faceScale?: number };
type Props = Placement & {
  ink?: string;
  paper?: string;
  /** Cell height in CSS px (Micro = 6). */
  cell?: number;
  /** Face placement used when the canvas is narrower than 600px. */
  narrow?: Placement;
  className?: string;
};

// The "Type" set. Slots: 0 background, 1 horizontal, 2 vertical, 3 "/", 4 "\",
// 5 light, 6 mid, 7–8 heavy. Then the switching pools by weight class.
const SLOTS = ["-", "-", "|", "/", "\\", ":", "+", "#", "@"];
const HEAVY = "#@%&$8";
const MID = "+=*:";
const SCRAMBLE = "!<>_[]{}=+*^?#%$&@/\\";
const FONT = 'ui-monospace, "SFMono-Regular", "Cascadia Mono", "Roboto Mono", Menlo, monospace';
const PLATE: [number, number, number] = [0.949, 0.271, 0.42];
const MASK_SIZE = 1024;

const rgb = (hex: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255) as [number, number, number];

let maskPromise: Promise<Uint8Array> | null = null;
/** Face drawing → ink coverage (0–255), GL row order (bottom row first). */
function loadMask(): Promise<Uint8Array> {
  maskPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = c.height = MASK_SIZE;
      const x = c.getContext("2d", { willReadFrequently: true })!;
      x.fillStyle = "#fff";
      x.fillRect(0, 0, MASK_SIZE, MASK_SIZE);
      x.drawImage(img, 0, 0, MASK_SIZE, MASK_SIZE);
      const d = x.getImageData(0, 0, MASK_SIZE, MASK_SIZE).data;
      const m = new Uint8Array(MASK_SIZE * MASK_SIZE);
      for (let y = 0; y < MASK_SIZE; y++)
        for (let i = 0; i < MASK_SIZE; i++) m[(MASK_SIZE - 1 - y) * MASK_SIZE + i] = 255 - d[(y * MASK_SIZE + i) * 4];
      resolve(m);
    };
    img.onerror = reject;
    img.src = "/img/terry-face-drawing.png";
  });
  return maskPromise;
}

/** Glyph atlas: one row, every slot and pool glyph, heavy ones in an extra-heavy cut. */
function atlas(px: number) {
  const chars = [...SLOTS, ...HEAVY, ...MID, ...SCRAMBLE];
  const cw = Math.max(1, Math.round(px * 0.62));
  const c = document.createElement("canvas");
  c.width = cw * chars.length;
  c.height = px;
  const x = c.getContext("2d")!;
  x.fillStyle = "#000";
  x.fillRect(0, 0, c.width, c.height);
  x.fillStyle = x.strokeStyle = "#fff";
  x.textAlign = "center";
  x.textBaseline = "middle";
  x.font = `700 ${Math.round(px * 0.9)}px ${FONT}`;
  x.lineWidth = Math.max(1, px * 0.11);
  chars.forEach((k, i) => {
    x.fillText(k, cw * i + cw / 2, px * 0.54);
    if (i >= 7 && i < 9 + HEAVY.length) x.strokeText(k, cw * i + cw / 2, px * 0.54);
  });
  return {
    canvas: c,
    count: chars.length,
    heavy: [9, HEAVY.length],
    mid: [9 + HEAVY.length, MID.length],
    pool: [9 + HEAVY.length + MID.length, SCRAMBLE.length],
  };
}

const VS = `#version 300 es
in vec2 a; out vec2 vUv; void main(){ vUv = a * .5 + .5; gl_Position = vec4(a, 0., 1.); }`;
const FS = (body: string) => `#version 300 es
precision highp float; in vec2 vUv; out vec4 o; ${body}`;

const ADVECT = FS(`uniform sampler2D uVel; uniform float dt, dis; void main(){ o = dis * texture(uVel, vUv - dt * texture(uVel, vUv).xy); }`);
const SPLAT = FS(`uniform sampler2D uSrc; uniform vec2 pt, force; uniform float r, aspect;
  void main(){ vec2 d = vUv - pt; d.x *= aspect; o = texture(uSrc, vUv) + vec4(force * exp(-dot(d,d) / r), 0., 0.); }`);
const DIVERGE = FS(`uniform sampler2D uVel; uniform vec2 tx;
  void main(){ o = vec4(.5 * (texture(uVel, vUv + vec2(tx.x,0)).x - texture(uVel, vUv - vec2(tx.x,0)).x + texture(uVel, vUv + vec2(0,tx.y)).y - texture(uVel, vUv - vec2(0,tx.y)).y), 0, 0, 1); }`);
const JACOBI = FS(`uniform sampler2D uP, uDiv; uniform vec2 tx;
  void main(){ o = vec4((texture(uP, vUv - vec2(tx.x,0)).x + texture(uP, vUv + vec2(tx.x,0)).x + texture(uP, vUv - vec2(0,tx.y)).x + texture(uP, vUv + vec2(0,tx.y)).x - texture(uDiv, vUv).x) * .25, 0, 0, 1); }`);
const PROJECT = FS(`uniform sampler2D uP, uVel; uniform vec2 tx;
  void main(){ o = vec4(texture(uVel, vUv).xy - .5 * vec2(texture(uP, vUv + vec2(tx.x,0)).x - texture(uP, vUv - vec2(tx.x,0)).x, texture(uP, vUv + vec2(0,tx.y)).x - texture(uP, vUv - vec2(0,tx.y)).x), 0, 1); }`);
const DISP = FS(`uniform sampler2D uVel, uDisp; uniform float dt, relax;
  void main(){ vec2 v = texture(uVel, vUv).xy; o = vec4(texture(uDisp, vUv - dt * v).xy * relax + v * dt, 0, 1); }`);
const RENDER = FS(`uniform sampler2D uDisp, uVel, uMask, uAtlas;
  uniform vec2 res, faceC, cell, ptr, heavy, mid, pool; uniform float faceS, maskSize, glyphs, t, intro, hover;
  uniform vec3 ink, paper, plate;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  float mask(vec2 p, float lod){ vec2 f = (p - faceC) / faceS + .5; if (f.x < 0. || f.y < 0. || f.x > 1. || f.y > 1.) return 0.; return textureLod(uMask, f, lod).r; }
  void main(){
    vec2 px = gl_FragCoord.xy, ci = floor(px / cell), cc = (ci + .5) * cell, uv = cc / res;
    vec2 d = texture(uDisp, uv).xy * res, v = texture(uVel, uv).xy * res;
    vec2 p = cc - d;
    float lod = max(0., log2(cell.y / (faceS / maskSize)) - .75);
    float cov = mask(p, lod);
    // Structure tensor over a 3x3 neighbourhood: a stable stroke direction.
    float gxx = 0., gyy = 0., gxy = 0., e = cell.y * .45;
    for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
      vec2 q = p + vec2(float(i), float(j)) * cell * .5;
      float gx = mask(q + vec2(e, 0.), lod) - mask(q - vec2(e, 0.), lod), gy = mask(q + vec2(0., e), lod) - mask(q - vec2(0., e), lod);
      gxx += gx * gx; gyy += gy * gy; gxy += gx * gy;
    }
    float strength = sqrt(gxx + gyy) / 3.;
    // Constant switching: each cell re-picks within its weight class on its own clock.
    float near = hover * exp(-dot(cc - ptr, cc - ptr) / (res.y * res.y * .02));
    float rate = (2.2 + 5. * near) * (.6 + hash(ci * 3.1));
    float tick = floor(t * rate + hash(ci) * 50.);
    float r = hash(ci + tick * .713);
    float slot, alpha = 1.;
    if (cov > .74) slot = heavy.x + floor(r * heavy.y);
    else if (strength > .2 && cov > .12) {
      float a = mod(.5 * atan(2. * gxy, gxx - gyy) + 1.5708, 3.14159);
      slot = (a < .3927 || a > 2.7489) ? 1. : (a < 1.1781 ? 3. : (a < 1.9635 ? 2. : 4.));
      if (r > .82) slot = mid.x + floor(hash(ci + tick) * mid.y);
    }
    else if (cov > .3) slot = mid.x + floor(r * mid.y);
    else { slot = r > .9 ? 5. : 0.; alpha = mod(ci.y, 2.) < 1. ? .2 : 0.; }
    // Scramble in the red plate: a fast flick, plus the print head sweeping down on load.
    float rowsFromTop = (res.y - cc.y) / cell.y, head = intro * (res.y / cell.y + 6.);
    float printing = clamp(1. - (head - rowsFromTop) / 3., 0., 1.);
    float speed = smoothstep(30., 420., length(v));
    float ftick = floor(t * 18.);
    bool scrambled = hash(ci + ftick) < max(speed, printing);
    if (scrambled) { slot = pool.x + floor(hash(ci * 1.7 + ftick) * pool.y); alpha = max(alpha, .9); }
    if (rowsFromTop > head) alpha = 0.;
    vec2 lc = fract(px / cell);
    float gi = texture(uAtlas, vec2((slot + lc.x) / glyphs, 1. - lc.y)).r * alpha;
    o = vec4(mix(paper, scrambled ? mix(ink, plate, .85) : ink, gi), 1.);
  }`);

type Prog = { p: WebGLProgram; u: Record<string, WebGLUniformLocation | null> };
function program(gl: WebGL2RenderingContext, fs: string): Prog {
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
    return s;
  };
  const p = gl.createProgram()!;
  gl.attachShader(p, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fs));
  gl.bindAttribLocation(p, 0, "a");
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
  const u: Prog["u"] = {};
  const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < n; i++) {
    const info = gl.getActiveUniform(p, i)!;
    u[info.name] = gl.getUniformLocation(p, info.name);
  }
  return { p, u };
}

type Target = { w: number; h: number; read: { tex: WebGLTexture; fb: WebGLFramebuffer }; write: { tex: WebGLTexture; fb: WebGLFramebuffer }; swap(): void };
function target(gl: WebGL2RenderingContext, w: number, h: number): Target {
  const make = () => {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fb = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    return { tex, fb };
  };
  let a = make(), b = make();
  return { w, h, get read() { return a; }, get write() { return b; }, swap() { [a, b] = [b, a]; } };
}

/** Static typed frame with canvas 2D, for browsers without WebGL2 float targets. */
function drawFallback(canvas: HTMLCanvasElement, mask: Uint8Array, o: Required<Placement> & { ink: string; paper: string; cell: number }) {
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  const W = canvas.clientWidth, H = canvas.clientHeight;
  canvas.width = Math.round(W * dpr);
  canvas.height = Math.round(H * dpr);
  const x = canvas.getContext("2d");
  if (!x) return;
  x.setTransform(dpr, 0, 0, dpr, 0, 0);
  x.fillStyle = o.paper;
  x.fillRect(0, 0, W, H);
  const ch = o.cell, cw = ch * 0.62, size = Math.min(W, H) * o.faceScale;
  const fx = W * o.faceX - size / 2, fy = H * o.faceY - size / 2;
  const cov = (px: number, py: number) => {
    const u = (px - fx) / size, v = (py - fy) / size;
    if (u < 0 || v < 0 || u >= 1 || v >= 1) return 0;
    return mask[(MASK_SIZE - 1 - Math.floor(v * MASK_SIZE)) * MASK_SIZE + Math.floor(u * MASK_SIZE)] / 255;
  };
  x.font = `700 ${Math.round(ch * 0.9)}px ${FONT}`;
  x.lineWidth = Math.max(0.6, ch * 0.11);
  x.textAlign = "center";
  x.textBaseline = "middle";
  for (let row = 0; row * ch < H; row++)
    for (let col = 0; col * cw < W; col++) {
      const cx = (col + 0.5) * cw, cy = (row + 0.5) * ch, c = cov(cx, cy);
      const gx = cov(cx + ch * 0.45, cy) - cov(cx - ch * 0.45, cy), gy = cov(cx, cy + ch * 0.45) - cov(cx, cy - ch * 0.45);
      let glyph: string, alpha = 1;
      if (c > 0.74) glyph = HEAVY[(row * 7 + col) % HEAVY.length];
      else if (Math.hypot(gx, gy) > 0.2 && c > 0.12) {
        const a = ((Math.atan2(-gy, gx) + Math.PI / 2) % Math.PI + Math.PI) % Math.PI;
        glyph = a < 0.3927 || a > 2.7489 ? "-" : a < 1.1781 ? "/" : a < 1.9635 ? "|" : "\\";
      } else if (c > 0.3) glyph = MID[(row + col) % MID.length];
      else if (row % 2 === 0) { glyph = "-"; alpha = 0.2; }
      else continue;
      x.globalAlpha = alpha;
      x.fillStyle = x.strokeStyle = o.ink;
      x.fillText(glyph, cx, cy);
      if (c > 0.74) x.strokeText(glyph, cx, cy);   // solid strokes: the same extra-heavy cut as the GL atlas
    }
  x.globalAlpha = 1;
}

export function TerrySymbols({
  ink = "#1233c7",
  paper = "#f7f6f1",
  cell = 6,
  faceX = 0.5,
  faceY = 0.5,
  faceScale = 0.8,
  narrow,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const nX = narrow?.faceX ?? faceX, nY = narrow?.faceY ?? faceY, nS = narrow?.faceScale ?? faceScale;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const placeFor = (cssW: number) => (cssW < 600 ? { x: nX, y: nY, s: nS } : { x: faceX, y: faceY, s: faceScale });
    let stopped = false;
    let cleanup = () => {};

    const gl = canvas.getContext("webgl2", { antialias: false, premultipliedAlpha: false });
    const glOk = !!gl && !!gl.getExtension("EXT_color_buffer_float");

    loadMask().then((mask) => {
      if (stopped) return;
      if (!glOk || !gl) {
        // No WebGL2 float targets: a static typed frame, redrawn on resize.
        const paint = () => { const pl = placeFor(canvas.clientWidth); drawFallback(canvas, mask, { ink, paper, cell, faceX: pl.x, faceY: pl.y, faceScale: pl.s }); };
        const ro = new ResizeObserver(paint);
        ro.observe(canvas);
        paint();
        cleanup = () => ro.disconnect();
        return;
      }
      cleanup = runGL(gl, canvas, mask);
    }).catch(() => { /* face image missing: leave the paper blank */ });

    function runGL(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement, mask: Uint8Array) {
      const quadVao = gl.createVertexArray();
      gl.bindVertexArray(quadVao);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const P = { advect: program(gl, ADVECT), splat: program(gl, SPLAT), diverge: program(gl, DIVERGE), jacobi: program(gl, JACOBI), project: program(gl, PROJECT), disp: program(gl, DISP), render: program(gl, RENDER) };

      const maskTex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, maskTex);
      gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, MASK_SIZE, MASK_SIZE, 0, gl.RED, gl.UNSIGNED_BYTE, mask);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const atlasTex = gl.createTexture()!;

      const inkRgb = rgb(ink), paperRgb = rgb(paper);
      let W = 0, H = 0, dpr = 1, cellPx = 6, glyphInfo = atlas(6);
      let sim!: Target, pres!: Target, div!: Target, disp!: Target;
      let raf = 0, visible = false, last = performance.now(), start = last, hoverA = 0;
      const pointer = { x: -1, y: -1, dx: 0, dy: 0, active: false };

      const resize = () => {
        dpr = Math.min(2, window.devicePixelRatio || 1);
        W = Math.max(1, Math.round(canvas.clientWidth * dpr));
        H = Math.max(1, Math.round(canvas.clientHeight * dpr));
        canvas.width = W;
        canvas.height = H;
        const sw = 160, sh = Math.max(32, Math.round((160 * H) / W));
        sim = target(gl, sw, sh); pres = target(gl, sw, sh); div = target(gl, sw, sh); disp = target(gl, sw, sh);
        cellPx = Math.max(5, Math.round(cell * dpr));
        glyphInfo = atlas(cellPx);
        gl.bindTexture(gl.TEXTURE_2D, atlasTex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, glyphInfo.canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      };

      const pass = (prog: Prog, out: Target | null, uniforms: Record<string, number | number[] | WebGLTexture>) => {
        gl.useProgram(prog.p);
        let unit = 0;
        for (const [k, v] of Object.entries(uniforms)) {
          const loc = prog.u[k];
          if (loc == null) continue;
          if (v instanceof WebGLTexture) { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, v); gl.uniform1i(loc, unit++); }
          else if (typeof v === "number") gl.uniform1f(loc, v);
          else if (v.length === 2) gl.uniform2fv(loc, v);
          else gl.uniform3fv(loc, v);
        }
        if (out) { gl.bindFramebuffer(gl.FRAMEBUFFER, out.write.fb); gl.viewport(0, 0, out.w, out.h); }
        else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, W, H); }
        gl.bindVertexArray(quadVao);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (out) out.swap();
      };

      const frame = (now: number) => {
        raf = 0;
        if (stopped) return;
        const dt = Math.min(1 / 30, (now - last) / 1000);
        last = now;
        const t = (now - start) / 1000, tx = [1 / sim.w, 1 / sim.h];
        if (pointer.active && (pointer.dx || pointer.dy)) {
          // Hovering stirs the switching; only a fast flick pushes the ink.
          const sp = Math.hypot(pointer.dx, pointer.dy) / Math.max(dt, 1e-3);
          const k = Math.min(1, Math.max(0, (sp - 250) / 900));
          if (k > 0) pass(P.splat, sim, { uSrc: sim.read.tex, pt: [(pointer.x * dpr) / W, (pointer.y * dpr) / H], force: [(pointer.dx * dpr * 9 * k) / W, (pointer.dy * dpr * 9 * k) / H], r: 0.0016, aspect: W / H });
          pointer.dx = pointer.dy = 0;
        }
        pass(P.advect, sim, { uVel: sim.read.tex, dt, dis: 0.985 });
        pass(P.diverge, div, { uVel: sim.read.tex, tx });
        for (let i = 0; i < 20; i++) pass(P.jacobi, pres, { uP: pres.read.tex, uDiv: div.read.tex, tx });
        pass(P.project, sim, { uP: pres.read.tex, uVel: sim.read.tex, tx });
        pass(P.disp, disp, { uVel: sim.read.tex, uDisp: disp.read.tex, dt, relax: 0.95 });
        hoverA += ((pointer.active && !reduce ? 1 : 0) - hoverA) * 0.1;
        const pl = placeFor(canvas.clientWidth);
        pass(P.render, null, {
          uDisp: disp.read.tex, uVel: sim.read.tex, uMask: maskTex, uAtlas: atlasTex,
          res: [W, H], faceC: [W * pl.x, H * (1 - pl.y)], faceS: Math.min(W, H) * pl.s,
          cell: [Math.max(1, Math.round(cellPx * 0.62)), cellPx], maskSize: MASK_SIZE,
          glyphs: glyphInfo.count, heavy: glyphInfo.heavy, mid: glyphInfo.mid, pool: glyphInfo.pool,
          ptr: [pointer.x * dpr, pointer.y * dpr], hover: hoverA,
          t: reduce ? 0 : t, intro: reduce ? 99 : t / 2.2,
          ink: inkRgb, paper: paperRgb, plate: PLATE,
        });
        if (!reduce && visible) raf = requestAnimationFrame(frame);
      };
      const kick = () => { if (!raf && !stopped) raf = requestAnimationFrame(frame); };

      const host = canvas.parentElement ?? canvas;
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        const px = e.clientX - r.left, py = r.height - (e.clientY - r.top);
        if (pointer.active) { pointer.dx += px - pointer.x; pointer.dy += py - pointer.y; }
        pointer.x = px; pointer.y = py; pointer.active = true;
      };
      const onLeave = () => { pointer.active = false; };
      if (!reduce) {
        host.addEventListener("pointermove", onMove);
        host.addEventListener("pointerdown", onMove);
        host.addEventListener("pointerleave", onLeave);
        host.addEventListener("pointercancel", onLeave);
      }
      const ro = new ResizeObserver(() => { resize(); kick(); });
      ro.observe(canvas);
      // Print-in starts the first time the graphic scrolls into view.
      let seen = false;
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !seen) { seen = true; start = last = performance.now(); }
        if (visible) kick();
      });
      io.observe(canvas);
      resize();

      return () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerdown", onMove);
        host.removeEventListener("pointerleave", onLeave);
        host.removeEventListener("pointercancel", onLeave);
      };
    }

    return () => {
      stopped = true;
      cleanup();
    };
  }, [ink, paper, cell, faceX, faceY, faceScale, nX, nY, nS]);

  return <canvas ref={ref} className={`terry-engraving${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
