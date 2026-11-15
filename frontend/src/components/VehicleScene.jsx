import { useEffect, useRef } from "react";
import { Car } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function VehicleScene() {
  const mount = useRef(null);
  useEffect(() => {
    const host = mount.current;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); }
    catch { return undefined; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-label", "Vehículo 3D");
    host.appendChild(renderer.domElement);
    host.dataset.renderer = "ready";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    camera.position.set(6.4, 3.8, 7.5);
    scene.add(new THREE.HemisphereLight(0xc3f9ff, 0x183040, 2.5));
    const key = new THREE.DirectionalLight(0x77eaff, 4);
    key.position.set(2, 6, 4); scene.add(key);
    const rim = new THREE.DirectionalLight(0xff9c3d, 2);
    rim.position.set(-4, 3, -2); scene.add(rim);

    const vehicle = new THREE.Group();
    const paint = new THREE.MeshStandardMaterial({ color: 0x193345, metalness: 0.65, roughness: 0.32 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x073341, metalness: 0.9, roughness: 0.15 });
    const rubber = new THREE.MeshStandardMaterial({ color: 0x090d12, roughness: 0.95 });
    const alloy = new THREE.MeshStandardMaterial({ color: 0x6d95a3, metalness: 0.8, roughness: 0.2 });
    const light = new THREE.MeshBasicMaterial({ color: 0x5deeff });
    const tailLight = new THREE.MeshBasicMaterial({ color: 0xff753c });
    const box = (width, height, depth, material, x, y, z) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), material);
      mesh.position.set(x, y, z); vehicle.add(mesh); return mesh;
    };
    box(4.5, 0.65, 1.95, paint, 0, 1, 0);
    box(2.1, 0.75, 1.8, glass, 0.35, 1.65, 0);
    box(2.25, 0.12, 1.95, paint, 0.35, 2.05, 0);
    box(1.2, 0.35, 1.85, paint, 1.55, 1.45, 0);
    box(1.45, 0.28, 0.1, paint, -1.45, 1.45, -0.95);
    box(1.45, 0.28, 0.1, paint, -1.45, 1.45, 0.95);
    box(0.1, 0.28, 1.95, paint, -2.2, 1.45, 0);
    box(0.1, 0.12, 1.6, light, 2.26, 1.18, 0);
    box(0.1, 0.25, 0.18, tailLight, -2.27, 1.1, -0.8);
    box(0.1, 0.25, 0.18, tailLight, -2.27, 1.1, 0.8);
    for (const x of [-1.5, 1.45]) {
      for (const z of [-1, 1]) {
        const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.43, 24), rubber);
        tire.rotation.x = Math.PI / 2; tire.position.set(x, 0.62, z); vehicle.add(tire);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.45, 12), alloy);
        hub.rotation.x = Math.PI / 2; hub.position.copy(tire.position); vehicle.add(hub);
      }
    }
    scene.add(vehicle);
    const grid = new THREE.GridHelper(24, 16, 0x126575, 0x0c2b3a);
    grid.material.transparent = true; grid.material.opacity = 0.4; scene.add(grid);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0); controls.enablePan = false; controls.enableZoom = false;
    controls.minPolarAngle = Math.PI / 5; controls.maxPolarAngle = Math.PI / 2.1;
    let lost = false;
    const render = () => {
      if (!lost && !document.hidden && host.clientWidth && host.clientHeight) renderer.render(scene, camera);
    };
    // Render por demanda: no quedan bucles de animación activos al cambiar de control.
    controls.addEventListener("change", render);
    const resize = () => {
      const { clientWidth: width, clientHeight: height } = host;
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix(); render();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    const onLost = (event) => { event.preventDefault(); lost = true; host.dataset.renderer = "fallback"; };
    const onRestored = () => { lost = false; host.dataset.renderer = "ready"; resize(); };
    renderer.domElement.addEventListener("webglcontextlost", onLost);
    renderer.domElement.addEventListener("webglcontextrestored", onRestored);
    document.addEventListener("visibilitychange", render);
    controls.update(); resize();
    return () => {
      observer.disconnect(); controls.dispose();
      document.removeEventListener("visibilitychange", render);
      renderer.domElement.removeEventListener("webglcontextlost", onLost);
      renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
      const geometries = new Set(); const materials = new Set();
      scene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        if (object.material) (Array.isArray(object.material) ? object.material : [object.material]).forEach((material) => materials.add(material));
      });
      geometries.forEach((geometry) => geometry.dispose()); materials.forEach((material) => material.dispose());
      renderer.dispose(); renderer.forceContextLoss(); renderer.domElement.remove(); delete host.dataset.renderer;
    };
  }, []);
  return <div className="vehicle-scene" ref={mount}><div className="vehicle-fallback" role="img" aria-label="Vista del vehículo"><Car strokeWidth={1} /><span>TROPHY TRUCK</span></div></div>;
}
