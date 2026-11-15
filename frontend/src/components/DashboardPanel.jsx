import { useEffect, useRef, useState } from "react";
import {
  Activity, Bell, Car, ChevronRight, Compass,
  Gauge, Leaf, Menu, Mic, Navigation, Phone,
  Play, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Thermometer,
  Wifi, Wind, Wrench, Zap,
} from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const TelemetryCard = ({ icon: Icon, label, value, unit, tone, progress, testId }) => (
  <div className={`tt-telemetry tt-tone-${tone}`}>
    <div className="tt-telemetry-top"><Icon size={18} strokeWidth={2.2} /><span>{label}</span><ChevronRight size={16} className="ml-auto opacity-70" /></div>
    <div className="tt-telemetry-value" data-testid={testId}>{value}<small>{unit}</small></div>
    <div className="tt-progress"><span style={{ width: `${Math.min(100, progress)}%` }} /></div>
  </div>
);

const StatusCard = ({ icon: Icon, label, value, tone = "green" }) => (
  <div className="tt-status-card"><Icon size={22} className={`tt-status-icon tt-${tone}`} /><div><strong>{label}</strong><span className={`tt-status-value tt-${tone}`}><i />{value}</span></div><ChevronRight size={17} className="ml-auto opacity-70" /></div>
);

const GaugeRing = ({ type, value, label, unit, tone }) => (
  <div className={`tt-ring tt-ring-${tone}`}><div className="tt-ring-inner"><span>{label}</span><strong>{value}</strong><small>{unit}</small></div><div className="tt-ring-sweep" /><div className="tt-ring-label">{type}</div></div>
);

const DashboardPanel = ({ sections = [], moduleGroups = [], onOpenSection, onOpenNotifications, onOpenQuickSettings, onOpenVehicleControl, onOpenMinimalDashboard }) => {
  const [systemStatus] = useState({ battery: 78 });
  const [driveMode, setDriveMode] = useState("Normal");
  const [activeView, setActiveView] = useState("board");
  const [activeGroup, setActiveGroup] = useState(moduleGroups[0]?.id || "driving");
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    const host = mountRef.current;
    const scene = new THREE.Scene(); scene.background = new THREE.Color(0x050b13);
    const camera = new THREE.PerspectiveCamera(55, host.clientWidth / host.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setSize(host.clientWidth, host.clientHeight); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); host.appendChild(renderer.domElement);
    const ambient = new THREE.AmbientLight(0x4ef3ff, 0.65); const key = new THREE.DirectionalLight(0x9bfaff, 1.5); key.position.set(4, 8, 6); scene.add(ambient, key);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshBasicMaterial({ color: 0x06111d })); ground.rotation.x = -Math.PI / 2; ground.position.y = -0.05; scene.add(ground);
    for (let i = -8; i <= 8; i += 2) { const line = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.01, 14), new THREE.MeshBasicMaterial({ color: 0x0aa9d8 })); line.position.set(i, 0.01, 1); scene.add(line); }
    const vehicle = new THREE.Group();
    const body = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1, 2), new THREE.MeshPhysicalMaterial({ color: 0x0c2438, metalness: 0.8, roughness: 0.18, emissive: 0x063a54, emissiveIntensity: 0.8 })); body.position.y = 1.05; vehicle.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(2, 0.75, 1.75), new THREE.MeshPhysicalMaterial({ color: 0x02131f, metalness: 0.2, roughness: 0.1, transparent: true, opacity: 0.9 })); cabin.position.set(-0.35, 1.75, 0); vehicle.add(cabin);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x09d9ff, emissive: 0x05627a, emissiveIntensity: 1.2 });
    [[-1.5, 0.5, 1], [-1.5, 0.5, -1], [1.5, 0.5, 1], [1.5, 0.5, -1]].forEach(([x, y, z]) => { const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.16, 12, 40), wheelMaterial); wheel.position.set(x, y, z); wheel.rotation.z = Math.PI / 2; vehicle.add(wheel); });
    scene.add(vehicle); camera.position.set(5.5, 3.1, 5.8); const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; controls.enablePan = false; controls.minDistance = 4; controls.maxDistance = 8; controls.target.set(0, 1, 0);
    let frame; const animate = () => { frame = requestAnimationFrame(animate); vehicle.rotation.y += 0.0015; controls.update(); renderer.render(scene, camera); }; animate();
    const resize = () => { if (!host.clientWidth) return; camera.aspect = host.clientWidth / host.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(host.clientWidth, host.clientHeight); }; window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); controls.dispose(); renderer.dispose(); host.removeChild(renderer.domElement); };
  }, []);

  const speed = 85; const rpm = 2850; const torque = 420; const temp = 32; const battery = systemStatus.battery;
  const modes = [{ label: "Eco", icon: Leaf }, { label: "Normal", icon: Activity }, { label: "Sport", icon: Zap }, { label: "Off-Road", icon: Wind }, { label: "Custom", icon: Settings2 }];
  return (
    <section className="tt-dashboard" data-testid="dashboard-panel">
      <header className="tt-topbar"><div className="tt-brand"><div className="tt-brand-mark"><Car size={23} /></div><div><strong>Trophy Truck</strong><span>Eléctrico · <b>Online</b></span></div></div><div className="tt-style"><span>BMW Style</span><ChevronRight size={16} /></div><div className="tt-top-actions"><button aria-label="Buscar"><Compass size={18} /></button><button onClick={onOpenNotifications} aria-label="Notificaciones"><Bell size={18} /></button><button className="tt-active-action" onClick={onOpenQuickSettings} aria-label="Actividad"><Activity size={18} /></button><button onClick={onOpenQuickSettings} aria-label="Configuración"><Settings2 size={18} /></button><button onClick={onOpenMinimalDashboard} aria-label="Pantalla completa"><Menu size={18} /></button></div></header>
      <div className="tt-subnav"><button className={activeView === "board" ? "active" : ""} onClick={() => setActiveView("board")}><Gauge size={16} /> Tablero</button><button className={activeView === "main" ? "active" : ""} onClick={() => setActiveView("main")}><Menu size={16} /> Pantalla principal</button><button onClick={onOpenVehicleControl}><Car size={16} /> Vehículo</button><button onClick={onOpenQuickSettings}><Wrench size={16} /> Ajustes</button></div>
      {activeView === "main" ? <div className="tt-main-screen"><div className="tt-main-screen-heading"><div><span>CONTROL CENTRAL</span><h2>Pantalla principal</h2><p>Organizado por sistemas para que encuentres todo en segundos.</p></div><div className="tt-main-screen-status"><i /> Sistema online</div></div><div className="tt-category-tabs">{moduleGroups.map(({ id, name, icon: Icon, modules }) => <button key={id} className={activeGroup === id ? "active" : ""} onClick={() => setActiveGroup(id)}><Icon size={18} /><span>{name}</span><small>{modules.length}</small></button>)}</div><div className="tt-module-grid">{(moduleGroups.find((group) => group.id === activeGroup)?.modules || sections).map(({ id, name, icon: Icon }) => <button key={id} onClick={() => onOpenSection(id)} className="tt-module-card"><span className="tt-module-icon"><Icon size={22} /></span><span><strong>{name}</strong><small>Gestionar sistema</small></span><ChevronRight size={17} /></button>)}</div></div> : <div className="tt-main-grid"><aside className="tt-left-column"><TelemetryCard icon={Gauge} label="Velocidad" value={speed} unit="km/h" tone="cyan" progress={speed / 2} testId="card-speed" /><TelemetryCard icon={Zap} label="Batería" value={battery} unit="%" tone="green" progress={battery} testId="card-battery" /><TelemetryCard icon={Thermometer} label="Temperatura" value={temp} unit="°C" tone="orange" progress={temp * 2} testId="card-temp" /><div className="tt-mini-stat"><span>Autonomía</span><strong>456 <small>km</small></strong><span className="tt-green"><i />Óptima</span></div></aside>
        <main className="tt-center-stage"><div className="tt-gauge-row"><GaugeRing type="RPM" value={rpm.toLocaleString()} label="RPM" unit="" tone="green" /><GaugeRing type="TORQUE" value={torque} label="Torque" unit="Nm" tone="orange" /></div><div className="tt-scene"><div ref={mountRef} className="tt-three-canvas" /><div className="tt-speed-display"><strong data-testid="header-speed">{speed}</strong><span>km/h</span></div><div className="tt-scene-caption"><span><Wifi size={13} /> GPS conectado</span><span>Modo {driveMode}</span></div></div><div className="tt-drive-selector"><span>Modo: Conducción</span>{modes.map(({ label, icon: Icon }) => <button key={label} className={driveMode === label ? "active" : ""} onClick={() => setDriveMode(label)}><Icon size={14} />{label}</button>)}</div></main>
        <aside className="tt-right-column"><StatusCard icon={ShieldCheck} label="Seguridad" value="Protegido" /><StatusCard icon={Activity} label="Estado" value="Óptimo" /><StatusCard icon={Zap} label="Potencia" value="Disponible" /><StatusCard icon={Wind} label="Aerodinámica" value="Activa" /><div className="tt-control-row"><button onClick={onOpenQuickSettings}><SlidersHorizontal size={17} /> Ajustes</button><button onClick={onOpenVehicleControl}><Car size={17} /> Control</button></div></aside></div>}
      <footer className="tt-dock"><button><Play size={17} /><span>Media</span></button><button><Navigation size={18} /><span>Navegación</span></button><button><Phone size={17} /><span>Teléfono</span></button><button className="tt-dock-car" onClick={onOpenVehicleControl}><Car size={23} /></button><button><Sparkles size={17} /><span>Confort</span></button><button><SlidersHorizontal size={17} /><span>Controles</span></button><button><Mic size={17} /><span>Asistente</span></button></footer>
    </section>
  );
};

export default DashboardPanel;
