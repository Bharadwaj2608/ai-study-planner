import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

/**
 * A lightweight, performant 3D background:
 * - Floating low-poly icosahedron with wireframe
 * - Particle starfield
 * - Subtle camera parallax tied to mouse
 * - GSAP scroll-linked rotation
 */
export default function ThreeBackground() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07070d, 0.06);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const point = new THREE.PointLight(0x7c5cff, 2.2, 30);
    point.position.set(4, 3, 5);
    const point2 = new THREE.PointLight(0x22d3ee, 1.8, 30);
    point2.position.set(-5, -2, 4);
    scene.add(ambient, point, point2);

    // Hero shape
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0xa78bfa,
      metalness: 0.4,
      roughness: 0.25,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.35 })
    );
    mesh.add(wire);

    // Particles
    const PARTICLES = 1200;
    const positions = new Float32Array(PARTICLES * 3);
    for (let i = 0; i < PARTICLES; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);

    // GSAP intro
    gsap.fromTo(
      mesh.scale,
      { x: 0.001, y: 0.001, z: 0.001 },
      { x: 1, y: 1, z: 1, duration: 1.6, ease: "elastic.out(1, 0.6)" }
    );
    gsap.fromTo(camera.position, { z: 14 }, { z: 6, duration: 1.6, ease: "power3.out" });

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove);

    // Resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Scroll rotation
    const onScroll = () => {
      const y = window.scrollY;
      gsap.to(mesh.rotation, { x: y * 0.002, duration: 0.4, overwrite: true });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf;
    const tick = () => {
      mesh.rotation.y += 0.003;
      points.rotation.y += 0.0006;

      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      pGeo.dispose();
      pMat.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="bg-canvas" aria-hidden="true" />;
}
