import React, { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Wifi, Bluetooth, Battery, Gauge, Thermometer } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";

const GLB_URL = "https://customer-assets.emergentagent.com/job_smart-truck-ui/artifacts/0qjgybqg_d73c3452-8ad5-46d4-885f-1fad9f44454c.glb";

const DashboardPanel = () => {
  const [systemStatus] = useState({ battery: 78, range: 456, connectivity: true, health: 97, cycles: 1247 });
  const [showBattery, setShowBattery] = useState(false);
  const [loading3D, setLoading3D] = useState(true);

  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer, scene, camera, controls, frameId;
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let modelGroup = null;
    let clickableParts = [];
    let placeholder = null;

    const sizes = {
      width: container.clientWidth || 800,
      height: container.clientHeight || 450,
      dpr: Math.min(window.devicePixelRatio || 1, 2),
    };

    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x02060b, 0.06);

    // Camera
    camera = new THREE.PerspectiveCamera(55, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(7, 4, 8);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(sizes.dpr);
    if (THREE.SRGBColorSpace) renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // Lights
    const hemi = new THREE.HemisphereLight(0x9cfaff, 0x0a1e2a, 0.9);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0x7ff8ff, 1.2);
    dir.position.set(5, 10, 7);
    scene.add(dir);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.target.set(0, 1.2, 0);

    // Helpers
    const grid = new THREE.GridHelper(40, 40, 0x123744, 0x0c2a33);
    scene.add(grid);

    // Fit camera helper
    function fitToObject(object) {
      const box = new THREE.Box3().setFromObject(object);
      const size = new THREE.Vector3(); box.getSize(size);
      const center = new THREE.Vector3(); box.getCenter(center);
      const maxDim = Math.max(size.x, size.y, size.z);
      const fov = camera.fov * (Math.PI / 180);
      let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)));
      cameraZ *= 1.4;
      camera.position.set(center.x + cameraZ * 0.35, center.y + cameraZ * 0.3, center.z + cameraZ);
      controls.target.copy(new THREE.Vector3(center.x, center.y + size.y * 0.1, center.z));
      controls.update();
    }

    // Placeholder simple (por si falla GLB)
    function buildPlaceholder() {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color: 0x2dd4bf, metalness: 0.1, roughness: 0.3, opacity: 0.7, transparent: true });
      const body = new THREE.Mesh(new THREE.BoxGeometry(5.2, 1.0, 2.2), mat); body.position.y = 1.2; group.add(body);
      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.0, 2.1), mat); cabin.position.set(-0.8, 1.8, 0); group.add(cabin);
      const bed = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.0, 2.15), mat); bed.position.set(1.2, 1.5, 0); group.add(bed);
      function wheel(x,z){ const m = new THREE.Mesh(new THREE.TorusGeometry(0.65, 0.18, 12, 24), mat); m.rotation.x = Math.PI/2; m.position.set(x, 0.65, z); group.add(m); }
      wheel(-1.6,  1.05); wheel(-1.6, -1.05); wheel( 1.8,  1.05); wheel( 1.8, -1.05);
      group.name = 'placeholder';
      scene.add(group);
      fitToObject(group);
      return group;
    }

    // GLB loader
    const manager = new THREE.LoadingManager();
    const loader = new GLTFLoader(manager);
    loader.setCrossOrigin('anonymous');

    manager.onLoad = () => { setLoading3D(false); };
    manager.onError = () => { setLoading3D(false); };

    loader.load(
      GLB_URL,
      (gltf) => {
        modelGroup = gltf.scene || gltf.scenes?.[0];
        if (!modelGroup) {
          placeholder = buildPlaceholder();
          return;
        }
        scene.add(modelGroup);
        modelGroup.traverse((o) => {
          if (o.isMesh) {
            o.castShadow = false;
            o.receiveShadow = false;
            o.frustumCulled = true;
          }
        });
        fitToObject(modelGroup);

        // Detect battery nodes
        const batteryCandidates = [];
        modelGroup.traverse((o) => {
          if (!o.name) return;
          const n = o.name.toLowerCase();
          if (n.includes('batt') || n.includes('battery') || n.includes('bater') || n.includes('batería') || n.includes('bateria') || n.includes('accu') || n.includes('pack')) {
            batteryCandidates.push(o);
          }
        });
        clickableParts = batteryCandidates.length > 0 ? batteryCandidates : [modelGroup];
      },
      undefined,
      () => {
        // Fallback silencioso
        placeholder = buildPlaceholder();
      }
    );

    // Interaction
    const onMouseMove = (e) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onClick = () => {
      const targets = clickableParts && clickableParts.length > 0 ? clickableParts : (placeholder ? [placeholder] : []);
      if (targets.length === 0) return;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(targets, true);
      if (hits.length > 0) {
        setShowBattery(true);
      }
    };

    const onDblClick = () => {
      const obj = modelGroup || placeholder;
      if (!obj) return;
      fitToObject(obj);
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('click', onClick);
    renderer.domElement.addEventListener('dblclick', onDblClick);

    // Loop
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      sizes.width = container.clientWidth;
      sizes.height = container.clientHeight;
      renderer.setSize(sizes.width, sizes.height);
      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('click', onClick);
        renderer.domElement.removeEventListener('dblclick', onDblClick);
      }
      if (frameId) cancelAnimationFrame(frameId);
      controls?.dispose();
      renderer?.dispose();
      if (renderer?.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  const bottomOptions = [
    "Navegación", "Asiento", "Luces", "Ventanas", "Carga",
    "ISOFIX", "Seguridad", "Conexión", "Notificaciones",
    "Voz", "Pantalla", "Personalización"
  ];

  const autonomyKm = Math.round(systemStatus.battery * 7.5);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-12 sm:h-14 bg-gray-900 flex items-center justify-between px-4 sm:px-6 rounded-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-base font-bold text-white">BMW Style</span>
          <Badge className="bg-blue-600 text-xs">Dashboard</Badge>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-blue-400">
          <Wifi size={14} />
          <Bluetooth size={14} />
          <span className="text-xs sm:text-sm text-white">{systemStatus.battery}%</span>
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col sm:flex-row gap-4 py-4">
        {/* Vehicle 3D (GLB/Placeholder) */}
        <div className="flex-1 flex items-center justify-center p-0 sm:p-2 min-h-[360px]">
          <div ref={mountRef} className="relative w-full h-[380px] sm:h-[460px] rounded-md overflow-hidden border border-slate-800">
            {loading3D && (
              <div className="absolute inset-0 flex items-center justify-center text-cyan-200/80 text-xs bg-black/10 pointer-events-none">Cargando 3D…</div>
            )}
          </div>
        </div>

        {/* Status cards */}
        <div className="w-full sm:w-80 space-y-3">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">Velocidad</Badge>
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-1">85 km/h</div>
              <Progress value={42} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Battery className="w-5 h-5 text-green-400" />
                <Badge variant="outline" className="text-green-400 border-green-400">Batería</Badge>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1">{systemStatus.battery}%</div>
              <Progress value={systemStatus.battery} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                <Badge variant="outline" className="text-orange-400 border-orange-400">Temperatura</Badge>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1">32°C</div>
              <Progress value={64} className="h-2" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom quick functions */}
      <div className="h-16 sm:h-20 bg-gray-900 border-t border-gray-700 px-2 sm:px-4 py-2 rounded-md">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          {bottomOptions.map((option, i) => (
            <div key={i} className="flex-shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-10 sm:h-12 text-xs text-gray-300 bg-gray-800 rounded">
              <span className="text-[10px] leading-none">{option.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de datos de Batería (abre al clic) */}
      <Dialog open={showBattery} onOpenChange={setShowBattery}>
        <DialogContent className="bg-slate-900 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>Estado de Batería</DialogTitle>
            <DialogDescription>Detalle de carga, autonomía y salud</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Nivel</div>
                <div className="text-3xl font-bold text-green-400 mb-2">{systemStatus.battery}%</div>
                <Progress value={systemStatus.battery} className="h-2" />
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Autonomía Estimada</div>
                <div className="text-3xl font-bold text-cyan-400 mb-2">{autonomyKm} km</div>
                <div className="text-xs text-slate-500">≈ 7.5 km por % de carga</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Salud</div>
                <div className="text-3xl font-bold text-blue-400 mb-2">{systemStatus.health}%</div>
                <div className="text-xs text-slate-500">Ciclos: {systemStatus.cycles}</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-slate-600">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-slate-400 mb-1">Tiempo a 100%</div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">{Math.max(0, 100 - systemStatus.battery)} min</div>
                <div className="text-xs text-slate-500">Carga rápida 1%/min (sim)</div>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardPanel;