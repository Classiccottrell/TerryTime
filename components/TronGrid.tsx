"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed full-viewport perspective grid + distant skyline + moving cars,
 * cobalt ink on the shop's own ground. Reacts to scroll (grid creep,
 * skyline parallax drift, cars speeding up) so motion continues as the
 * page scrolls, not just in the hero. Freezes to a static frame under
 * prefers-reduced-motion.
 */
export function TronGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const INK = "18,51,199";
    let W = 0;
    let H = 0;
    let HORIZON = 0;
    let scrollFrac = 0;
    let raf = 0;

    type Building = { x: number; w: number; h: number; lit: boolean; blink: number };
    let buildings: Building[] = [];
    function seedBuildings() {
      buildings = [];
      const n = 22;
      for (let i = 0; i < n; i++) {
        buildings.push({
          x: i / n + (Math.random() - 0.5) * (0.6 / n),
          w: 0.012 + Math.random() * 0.03,
          h: 0.06 + Math.random() * 0.22,
          lit: Math.random() < 0.5,
          blink: 2 + Math.random() * 4,
        });
      }
    }

    type Car = { lane: number; x: number; speed: number; dir: number };
    let cars: Car[] = [];
    function seedCars() {
      cars = [];
      const lanes = [0.62, 0.72, 0.84];
      for (let i = 0; i < lanes.length; i++) {
        cars.push({ lane: lanes[i], x: Math.random(), speed: 0.00025 + Math.random() * 0.00035, dir: i % 2 === 0 ? 1 : -1 });
        cars.push({ lane: lanes[i], x: Math.random(), speed: 0.00025 + Math.random() * 0.00035, dir: i % 2 === 0 ? 1 : -1 });
      }
    }

    function size() {
      W = canvas!.width = window.innerWidth;
      H = canvas!.height = window.innerHeight;
      HORIZON = H * 0.4;
    }

    function drawScene(t: number) {
      ctx!.clearRect(0, 0, W, H);

      const parallax = Math.min(scrollFrac * 40, 60);
      const horizonY = HORIZON - parallax * 0.3;

      ctx!.strokeStyle = `rgba(${INK},0.5)`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(0, horizonY);
      ctx!.lineTo(W, horizonY);
      ctx!.stroke();

      const skylineShift = scrollFrac * 30;
      for (const b of buildings) {
        const bx = ((b.x * W + skylineShift) % (W + 60)) - 30;
        const bh = b.h * H * 0.55;
        const bw = b.w * W;
        ctx!.strokeStyle = `rgba(${INK},0.55)`;
        ctx!.strokeRect(bx, horizonY - bh, bw, bh);
        if (!reduced && b.lit) {
          const flicker = 0.35 + 0.25 * Math.abs(Math.sin(t / 900 + b.blink));
          ctx!.fillStyle = `rgba(${INK},${flicker})`;
          ctx!.fillRect(bx + bw * 0.3, horizonY - bh * 0.7, Math.max(1, bw * 0.18), Math.max(1, bw * 0.18));
        }
      }

      const vpX = W / 2;
      ctx!.strokeStyle = `rgba(${INK},0.32)`;
      const vCount = 26;
      for (let i = 0; i <= vCount; i++) {
        const frac = i / vCount;
        const bottomX = frac * W * 1.6 - W * 0.3;
        ctx!.beginPath();
        ctx!.moveTo(vpX, horizonY);
        ctx!.lineTo(bottomX, H);
        ctx!.stroke();
      }

      const creep = (t * 0.00006 + scrollFrac * 0.4) % 1;
      const hCount = 14;
      for (let j = 0; j < hCount; j++) {
        const z = (j + creep) / hCount;
        const y = horizonY + Math.pow(z, 2.6) * (H - horizonY);
        const alpha = 0.06 + z * 0.4;
        ctx!.strokeStyle = `rgba(${INK},${alpha.toFixed(3)})`;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(W, y);
        ctx!.stroke();
      }

      if (!reduced) {
        for (const car of cars) {
          car.x += car.speed * car.dir * (1 + scrollFrac * 1.5);
          if (car.x > 1.05) car.x = -0.05;
          if (car.x < -0.05) car.x = 1.05;
          const cy = horizonY + (H - horizonY) * (0.4 + car.lane * 0.5);
          const cx = car.x * W;
          const len = 14 + car.lane * 10;
          ctx!.strokeStyle = `rgba(${INK},0.8)`;
          ctx!.lineWidth = 2;
          ctx!.beginPath();
          ctx!.moveTo(cx - len * car.dir, cy);
          ctx!.lineTo(cx, cy);
          ctx!.stroke();
        }
      }
    }

    function loop(t: number) {
      drawScene(t);
      if (!reduced) raf = requestAnimationFrame(loop);
    }

    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollFrac = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (reduced) drawScene(performance.now());
    }

    size();
    seedBuildings();
    seedCars();
    onScroll();

    const onResize = () => {
      size();
      seedBuildings();
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (reduced) {
      drawScene(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}
    />
  );
}
