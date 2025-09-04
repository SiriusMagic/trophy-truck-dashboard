import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Wifi, Bluetooth, Battery, Gauge, Thermometer } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader.js";

const REMOTE_GLB = "https://customer-assets.emergentagent.com/job_smart-truck-ui/artifacts/ilj85os8_49d52b49-e9e3-45da-97f8-0c9758da0b33.glb";
const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || (typeof import.meta !== 'undefined' ? import.meta.env?.REACT_APP_BACKEND_URL : '')) || '';
const PROXY_GLB = BACKEND_URL ? `${BACKEND_URL}/api/assets/proxy?u=${encodeURIComponent(REMOTE_GLB)}` : REMOTE_GLB;

const DashboardPanel = () => {
  const [systemStatus] = useState({ battery: 78, range: 456, connectivity: true, health: 97, cycles: 1247 });
  const [glbState, setGlbState] = useState({ status: "loading", error: null, cause: null });
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, controls, frameId;
    let modelGroup = null;

    const sizes = {
      width: container.clientWidth || 800,
      height: container.clientHeight || 450,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    };

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02060b, 0.06);

    camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(7, 4, 8);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.dpr);
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0x9cfaff, 0x0a1e2a, 0.9); scene.add(hemi);
    const dir = new THREE.DirectionalLight(0x7ff8ff, 1.2); dir.position.set(5, 10, 7); scene.add(dir);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.08; controls.target.set(0, 1.2, 0);

    const grid = new THREE.GridHelper(40, 40, 0x123744, 0x0c2a33); scene.add(grid);

    function fitToObject(object) {
      const box = new THREE.Box3().setFromObject(object);
      if (!box.isEmpty()) {
        const size = new THREE.Vector3(); box.getSize(size);
        const center = new THREE.Vector3(); box.getCenter(center);
        const maxDim = Math.max(size.x, size.y, size.z);
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
        cameraZ *= 1.4;
        camera.position.set(center.x + cameraZ * 0.35, center.y + cameraZ * 0.3, center.z + cameraZ);
        controls.target.copy(new THREE.Vector3(center.x, center.y + size.y * 0.1, center.z)); controls.update();
      }
    }

    function buildLoader(useLocalDraco) {
      const manager = new THREE.LoadingManager();
      const gltfLoader = new GLTFLoader(manager);
      gltfLoader.setCrossOrigin('anonymous');
      try {
        const draco = new DRACOLoader();
        draco.setDecoderPath(useLocalDraco ? '/draco/' : 'https://www.gstatic.com/draco/v1/decoders/');
        gltfLoader.setDRACOLoader(draco);
        gltfLoader.setMeshoptDecoder(MeshoptDecoder);
        const ktx2 = new KTX2Loader();
        ktx2.setTranscoderPath('https://unpkg.com/three@0.160.0/examples/jsm/libs/basis/');
        ktx2.detectSupport(renderer);
        gltfLoader.setKTX2Loader(ktx2);
      } catch (_) {}
      return gltfLoader;
    }

    const attempts = [
      [PROXY_GLB, true],
      [PROXY_GLB, false],
      [REMOTE_GLB, true],
      [REMOTE_GLB, false],
    ];

    const MAX_PER_ATTEMPT_MS = 20000;

    function loadWithTimeout(loader, src, ms) {
      return new Promise((resolve, reject) => {
        let done = false;
        const to = setTimeout(() => { if (!done) { done = true; reject(new Error('timeout')); } }, ms);
        loader.load(src, (gltf) => { if (done) return; done = true; clearTimeout(to); resolve(gltf); }, undefined, (err) => { if (done) return; done = true; clearTimeout(to); reject(err || new Error('onError')); });
      });
    }

    async function loadModel() {
      for (let i = 0; i < attempts.length; i++) {
        const [src, useLocalDraco] = attempts[i];
        try {
          setGlbState({ status: 'loading', error: null, cause: `attempt_${i+1}_${useLocalDraco?'localDraco':'remoteDraco'}` });
          const loader = buildLoader(useLocalDraco);
          const gltf = await loadWithTimeout(loader, src, MAX_PER_ATTEMPT_MS);
          modelGroup = gltf.scene || gltf.scenes?.[0];
          if (!modelGroup) throw new Error('empty_scene');
          scene.add(modelGroup);
          modelGroup.traverse((o) => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = true; } });
          fitToObject(modelGroup);
          setGlbState({ status: 'ready', error: null, cause: null });
          return;
        } catch (e) {
          if (i === attempts.length - 1) {
            setGlbState({ status: 'error', error: e?.message || String(e), cause: 'exhausted' });
          }
        }
      }
    }

    loadModel();

    const animate = () => { frameId = requestAnimationFrame(animate); controls.update(); renderer.render(scene, camera); };
    animate();

    const onResize = () => { if (!container) return; sizes.width = container.clientWidth; sizes.height = container.clientHeight; renderer.setSize(sizes.width, sizes.height); camera.aspect = sizes.width / sizes.height; camera.updateProjectionMatrix(); };
    window.addEventListener('resize', onResize);

    return () => { window.removeEventListener('resize', onResize); if (frameId) cancelAnimationFrame(frameId); controls?.dispose(); renderer?.dispose(); if (renderer?.domElement && renderer.domElement.parentNode === container) { container.removeChild(renderer.domElement); } };
  }, []);

  const autonomyKm = Math.round(systemStatus.battery * 7.5);

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 sm:h-14 bg-gray-900 flex items-center justify-between px-4 sm:px-6 rounded-md">
        <div className="flex items-center gap-2 sm:gap-3"><span className="text-sm sm:text-base font-bold text-white">BMW Style</span><Badge className="bg-blue-600 text-xs">Dashboard</Badge></div>
        <div className="flex items-center gap-2 sm:gap-3 text-blue-400"><Wifi size={14} /><Bluetooth size={14} /><span className="text-xs sm:text-sm text-white">{systemStatus.battery}%</span></div>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row gap-4 py-4">
        <div className="flex-1 flex items-center justify-center p-0 sm:p-2 min-h-[360px]">
          <div ref={mountRef} className="relative w-full h-[380px] sm:h-[460px] rounded-md overflow-hidden border border-slate-800" data-glb-state={glbState.status} data-glb-cause={glbState.cause || ''}>
            {glbState.status === 'loading' && (<div className="absolute inset-0 flex items-center justify-center text-cyan-200/80 text-xs bg-black/10 pointer-events-none">Cargando 3D…</div>)}
            {glbState.status === 'error' && (<div className="absolute inset-0 flex items-center justify-center text-red-300 text-xs bg-red-900/10 pointer-events-none">No se pudo cargar el modelo</div>)}
          </div>
        </div>

        <div className="w-full sm:w-80 space-y-3">
          <Card className="bg-slate-900/50 border-slate-700"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Gauge className="w-5 h-5 text-cyan-400" /><Badge variant="outline" className="text-cyan-400 border-cyan-400">Velocidad</Badge></div><div className="text-2xl font-bold text-cyan-400 mb-1">85 km/h</div><Progress value={42} className="h-2" /></CardContent></Card>
          <Card className="bg-slate-900/50 border-slate-700"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Battery className="w-5 h-5 text-green-400" /><Badge variant="outline" className="text-green-400 border-green-400">Batería</Badge></div><div className="text-2xl font-bold text-green-400 mb-1">{systemStatus.battery}%</div><Progress value={systemStatus.battery} className="h-2" /></CardContent></Card>
          <Card className="bg-slate-900/50 border-slate-700"><CardContent className="p-4"><div className="flex items-center justify-between mb-2"><Thermometer className="w-5 h-5 text-orange-400" /><Badge variant="outline" className="text-orange-400 border-orange-400">Temperatura</Badge></div><div className="text-2xl font-bold text-orange-400 mb-1">32°C</div><Progress value={64} className="h-2" /></CardContent></Card>
        </div>
      </div>

      <div className="h-16 sm:h-20 bg-gray-900 border-t border-gray-700 px-2 sm:px-4 py-2 rounded-md"><div className="flex gap-1 sm:gap-2 overflow-x-auto">{["Navegación","Asiento","Luces","Ventanas","Carga","ISOFIX","Seguridad","Conexión","Notificaciones","Voz","Pantalla","Personalización"].map((option, i) => (<div key={i} className="flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-10 sm:h-12 text-xs text-gray-300 bg-gray-800 rounded"><span className="text-[10px] leading-none">{option.split(" ")[0]}</span></div>))}</div></div>
    </div>
  );
};

export default DashboardPanel;