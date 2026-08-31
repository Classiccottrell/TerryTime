"use client";

export function Mascot3D() {
  return (
    <div
      className="mascot3d-wrap"
      role="img"
      aria-label="Terry mascot face"
      style={{ width: "100%", height: "100%", perspective: "900px" }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const stack = el.querySelector<HTMLElement>(".mascot3d-stack");
        if (stack) stack.style.transform = `rotateY(${x * 24}deg) rotateX(${y * -24}deg)`;
      }}
      onMouseLeave={(e) => {
        const stack = e.currentTarget.querySelector<HTMLElement>(".mascot3d-stack");
        if (stack) stack.style.transform = "rotateY(0deg) rotateX(0deg)";
      }}
    >
      <div className="mascot3d-stack" aria-hidden="true">
        <span className="mascot3d-face mascot3d-face--4" />
        <span className="mascot3d-face mascot3d-face--3" />
        <span className="mascot3d-face mascot3d-face--2" />
        <span className="mascot3d-face mascot3d-face--1" />
        <span className="mascot3d-face mascot3d-face--front" />
      </div>
    </div>
  );
}
