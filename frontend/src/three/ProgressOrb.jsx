import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * 3D progress orb that visualizes plan completion %.
 * Uses an animated emissive sphere whose hue + scale is driven by `progress` (0..1).
 */
export default function ProgressOrb({ progress = 0, size = 220 }) {
  const mountRef = useRef(null);
  const stateRef = useRef({ target: progress });

  useEffect(() => {
    const mount = mountRef.current;
    const w = size, h = size;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 50);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    const p1 = new THREE.PointLight(0x7c5cff, 2.5, 20);
    p1.position.set(3, 2, 4);
    const p2 = new THREE.PointLight(0x22d3ee, 1.8, 20);
    p2.position.set(-3, -2, 3);
    scene.add(ambient, p1, p2);

    const orbGeo = new THREE.SphereGeometry(1.2, 64, 64);
    const orbMat = new THREE.MeshStandardMaterial({
      color: 0x7c5cff,
      emissive: 0x7c5cff,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.2,
    });
    const orb = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orb);

    // Ring
    const ringGeo = new THREE.TorusGeometry(1.7, 0.04, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.7 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.4;
    scene.add(ring);

    let raf;
    const tick = () => {
      const t = stateRef.current.target;
      orb.rotation.y += 0.01;
      orb.rotation.x += 0.004;
      ring.rotation.z += 0.005;
      // Color shifts violet -> cyan -> green as progress increases
      const c = new THREE.Color().setHSL(0.72 - t * 0.4, 0.7, 0.55);
      orbMat.color.copy(c);
      orbMat.emissive.copy(c);
      orbMat.emissiveIntensity = 0.4 + t * 0.6;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      orbGeo.dispose(); orbMat.dispose(); ringGeo.dispose(); ringMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [size]);

  useEffect(() => {
    gsap.to(stateRef.current, { target: progress, duration: 0.8, ease: "power2.out" });
  }, [progress]);

  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <div ref={mountRef} />
      <div
        style={{
          position: "absolute", inset: 0, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: 28, pointerEvents: "none",
        }}
      >
        {Math.round(progress * 100)}%
      </div>
    </div>
  );
}
