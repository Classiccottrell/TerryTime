"use client";

import { useEffect, useRef } from "react";
import { asset } from "@/lib/site";

/**
 * "Terry engraving": linefield's contour-grid bands (github.com/Classiccottrell/linefield),
 * with the Terry face read as ink weight. Each horizontal band thickens and lifts
 * slightly where the face is dark, like a banknote engraving or the satin-stitch
 * rows of the hat embroidery. Purely decorative: aria-hidden, pauses off-screen,
 * and renders one still frame under prefers-reduced-motion.
 */
type Props = {
  ink?: string;
  paper?: string;
  /** Number of horizontal bands across the canvas height. */
  bands?: number;
  /** Face size as a fraction of the canvas's shorter side. */
  faceScale?: number;
  /** Face centre as a fraction of width / height (0–1). */
  faceX?: number;
  faceY?: number;
  /** Max extra line weight inside the face. */
  weight?: number;
  /** Face placement used instead when the canvas is narrower than 600px. */
  narrow?: { faceX?: number; faceY?: number; faceScale?: number };
  className?: string;
};

const FIELD = 180;
let fieldPromise: Promise<Float32Array> | null = null;

function loadField(): Promise<Float32Array> {
  fieldPromise ??= new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const off = document.createElement("canvas");
      off.width = off.height = FIELD;
      const o = off.getContext("2d")!;
      o.fillStyle = "#fff";
      o.fillRect(0, 0, FIELD, FIELD);
      o.drawImage(img, 8, 8, FIELD - 16, FIELD - 16);
      const d = o.getImageData(0, 0, FIELD, FIELD).data;
      let f: Float32Array = new Float32Array(FIELD * FIELD);
      for (let i = 0; i < f.length; i++) f[i] = 1 - (d[i * 4] + d[i * 4 + 1] + d[i * 4 + 2]) / 765;
      f = boxBlur(boxBlur(f));
      let max = 0;
      for (const v of f) max = Math.max(max, v);
      for (let i = 0; i < f.length; i++) f[i] /= max || 1;
      resolve(f);
    };
    img.onerror = reject;
    img.src = asset("/img/terry-face-mark.png");
  });
  return fieldPromise;
}

function boxBlur(src: Float32Array): Float32Array {
  const tmp = new Float32Array(src.length);
  const out = new Float32Array(src.length);
  const at = (x: number) => Math.min(FIELD - 1, Math.max(0, x));
  for (let y = 0; y < FIELD; y++)
    for (let x = 0; x < FIELD; x++)
      tmp[y * FIELD + x] = (src[y * FIELD + at(x - 1)] + src[y * FIELD + x] + src[y * FIELD + at(x + 1)]) / 3;
  for (let y = 0; y < FIELD; y++)
    for (let x = 0; x < FIELD; x++)
      out[y * FIELD + x] = (tmp[at(y - 1) * FIELD + x] + tmp[y * FIELD + x] + tmp[at(y + 1) * FIELD + x]) / 3;
  return out;
}

export function TerryEngraving({
  ink = "#1233c7",
  paper = "#f7f6f1",
  bands = 70,
  faceScale = 0.7,
  faceX = 0.5,
  faceY = 0.5,
  weight = 7,
  narrow,
  className,
}: Props) {
  const nX = narrow?.faceX ?? faceX, nY = narrow?.faceY ?? faceY, nScale = narrow?.faceScale ?? faceScale;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let field: Float32Array | null = null;
    let W = 0, H = 0, raf = 0, visible = false, stopped = false;
    const pointer = { x: -1e9, y: -1e9, a: 0 };

    const height = (px: number, py: number) => {
      if (!field) return 0;
      const small = W < 600;
      const fx0 = small ? nX : faceX, fy0 = small ? nY : faceY;
      const size = Math.min(W, H) * (small ? nScale : faceScale);
      const u = ((px - (W * fx0 - size / 2)) / size) * FIELD;
      const v = ((py - (H * fy0 - size / 2)) / size) * FIELD;
      if (u < 0 || v < 0 || u >= FIELD - 1 || v >= FIELD - 1) return 0;
      const x0 = u | 0, y0 = v | 0, fx = u - x0, fy = v - y0;
      const i = y0 * FIELD + x0;
      return (field[i] * (1 - fx) + field[i + 1] * fx) * (1 - fy) + (field[i + FIELD] * (1 - fx) + field[i + FIELD + 1] * fx) * fy;
    };
    const wob = (x: number, b: number, t: number) =>
      Math.sin(x * 0.011 + t * 1.3 + b * 0.03) * 0.6 + Math.sin(x * 0.023 - t * 0.9 + b * 0.017) * 0.4;

    const draw = (ms: number) => {
      const t = reduce ? 0 : (ms / 1000) * 0.25;
      pointer.a += ((pointer.x > -1e8 ? 1 : 0) - pointer.a) * 0.08;
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = ink;
      const gap = H / (bands + 1), lift = Math.min(W, H) * 0.02, step = 3;
      for (let b = 1; b <= bands; b++) {
        const base = b * gap;
        const top: number[] = [], bot: number[] = [];
        for (let x = -step; x <= W + step; x += step) {
          let h = height(x, base);
          if (pointer.a > 0.01) {
            const dx = x - pointer.x, dy = base - pointer.y;
            h = Math.min(1, h + Math.exp(-(dx * dx + dy * dy) / 7000) * 0.5 * pointer.a);
          }
          const y = base - h * lift + wob(x, b, t) * 4 * (0.25 + h);
          const half = (0.8 + h * h * weight * (gap / 6)) / 2;
          top.push(x, y - half);
          bot.push(x, y + half);
        }
        ctx.beginPath();
        ctx.moveTo(top[0], top[1]);
        for (let i = 2; i < top.length; i += 2) ctx.lineTo(top[i], top[i + 1]);
        for (let i = bot.length - 2; i >= 0; i -= 2) ctx.lineTo(bot[i], bot[i + 1]);
        ctx.closePath();
        ctx.fill();
      }
    };

    const loop = (ms: number) => {
      raf = 0;
      if (stopped) return;
      draw(ms);
      if (!reduce && visible) raf = requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf && !stopped) raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      kick();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) kick();
    });
    io.observe(canvas);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      kick();
    };
    const onLeave = () => {
      pointer.x = pointer.y = -1e9;
    };
    const host = canvas.parentElement ?? canvas;
    if (!reduce) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    loadField().then((f) => {
      field = f;
      kick();
    }).catch(() => {
      // Face image missing: the plain bands still render.
    });
    resize();

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [ink, paper, bands, faceScale, faceX, faceY, weight, nX, nY, nScale]);

  return <canvas ref={ref} className={`terry-engraving${className ? ` ${className}` : ""}`} aria-hidden="true" />;
}
