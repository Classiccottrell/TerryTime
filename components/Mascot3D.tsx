"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const MODEL_URL = "/models/custom-holographic.glb";
const IDLE_SPEED = 1.5 * (Math.PI * 2) / 60; // 1.5 rpm in radians/sec
const TILT_MAX_Y = (24 * Math.PI) / 180;
const TILT_MAX_X = (24 * Math.PI) / 180;
const TILT_LERP = 0.08;

export function Mascot3D() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const key = new THREE.DirectionalLight(0xffffff, 1.25);
    key.position.set(0.35, 0.55, 1);
    scene.add(ambient, key);

    // Fallback PBR material per 3d-render-prompt.md, used only if the glTF
    // ships primitives with no usable material.
    const fallbackMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7f78ff,
      roughness: 0.22,
      metalness: 1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.1,
      transmission: 0.19,
      thickness: 0.6,
      ior: 1.69,
    });

    let model: THREE.Object3D | null = null;
    let disposed = false;
    let idleAngle = 0;
    let tiltTargetX = 0;
    let tiltTargetY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let lastTime = performance.now();
    let rafId = 0;

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh && !child.material) {
            child.material = fallbackMaterial;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const sphere = box.getBoundingSphere(new THREE.Sphere());
        const radius = Math.max(sphere.radius, 0.001);
        const fovRad = (camera.fov * Math.PI) / 180;
        const distance = (radius / Math.sin(fovRad / 2)) / 0.97;

        const azimuth = (38 * Math.PI) / 180;
        const elevation = (15 * Math.PI) / 180;
        camera.position.set(
          distance * Math.sin(azimuth) * Math.cos(elevation),
          distance * Math.sin(elevation),
          distance * Math.cos(azimuth) * Math.cos(elevation)
        );
        camera.lookAt(0, 0, 0);

        scene.add(model);
      },
      undefined,
      (err) => {
        console.error("Mascot3D: failed to load model", err);
      }
    );

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight, false);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    const handlePointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiltTargetY = x * TILT_MAX_Y;
      tiltTargetX = -y * TILT_MAX_X;
    };
    const handlePointerLeave = () => {
      tiltTargetX = 0;
      tiltTargetY = 0;
    };
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerleave", handlePointerLeave);

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!reducedMotion.matches) {
        idleAngle += IDLE_SPEED * dt;
      }
      tiltX += (tiltTargetX - tiltX) * TILT_LERP;
      tiltY += (tiltTargetY - tiltY) * TILT_LERP;

      if (model) {
        model.rotation.y = idleAngle + tiltY;
        model.rotation.x = tiltX;
      }

      if (container.clientWidth > 0 && container.clientHeight > 0) {
        renderer.render(scene, camera);
      }
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          for (const mat of materials) {
            if (!mat) continue;
            for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "clearcoatMap", "clearcoatRoughnessMap"] as const) {
              const tex = (mat as THREE.MeshPhysicalMaterial)[key as keyof THREE.MeshPhysicalMaterial];
              if (tex instanceof THREE.Texture) tex.dispose();
            }
            mat.dispose();
          }
        }
      });
      fallbackMaterial.dispose();
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="mascot3d-wrap"
      role="img"
      aria-label="Terry mascot face"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
