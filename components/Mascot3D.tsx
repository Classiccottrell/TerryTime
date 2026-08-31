"use client";

export function Mascot3D() {
  return (
    <div
      className="mascot3d-wrap"
      style={{ width: "100%", height: "100%", perspective: "900px" }}
      onMouseMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        const face = el.querySelector<HTMLElement>(".mascot3d-face");
        if (face) face.style.transform = `rotateY(${x * 36}deg) rotateX(${y * -36}deg)`;
      }}
      onMouseLeave={(e) => {
        const face = e.currentTarget.querySelector<HTMLElement>(".mascot3d-face");
        if (face) face.style.transform = "rotateY(0deg) rotateX(0deg)";
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/terry-face.svg"
        alt="Terry mascot face"
        className="mascot3d-face"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          color: "var(--brutal-black)",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      />
    </div>
  );
}
