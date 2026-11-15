import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Bell, Car, Gauge, RotateCcw, Search, Settings, SlidersHorizontal } from "lucide-react";
import { allModules, systemGroups } from "../data/systemModules";
import { useVehicleState } from "../hooks/useVehicleState";
import SystemPanel from "./SystemPanel";

const DashboardPanel = lazy(() => import("./DashboardPanel"));

export default function FuturisticInterface() {
  const [isLandscape, setIsLandscape] = useState(() => window.innerWidth > window.innerHeight);
  const [selection, setSelection] = useState(null);
  const [visited, setVisited] = useState([]);
  const [simple, setSimple] = useState(false);
  const opener = useRef(null);
  const vehicle = useVehicleState();
  const selectedModule = allModules.find((module) => module.id === selection?.id);
  const selectedGroup = selection?.group || selectedModule?.group;

  useEffect(() => {
    const resize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const rememberOpener = () => {
    if (!selection) opener.current = document.activeElement;
  };
  const openModule = (id) => {
    if (!allModules.some((module) => module.id === id)) return;
    rememberOpener();
    setVisited((ids) => ids.includes(id) ? ids : [...ids, id]);
    setSelection({ kind: "module", id });
  };
  const openDirectory = (group = null) => {
    rememberOpener();
    setSelection({ kind: "directory", group });
  };
  const closePanel = () => {
    setSelection(null);
    opener.current?.focus({ preventScroll: true });
  };

  return (
    <div className="cockpit dark" data-testid="cockpit">
      <div className="cockpit-shell" inert={!isLandscape} onKeyDown={(event) => {
        if (event.key === "Escape" && selection) { event.preventDefault(); closePanel(); }
      }}>
        <header className="cockpit-header">
          <div className="cockpit-brand"><Car aria-hidden="true" /><div><strong>TROPHY TRUCK</strong><span>ELÉCTRICO / CENTRO DE CONTROL</span></div></div>
          <span className="demo-badge"><i /> Simulación</span>
          <div className="cockpit-actions">
            <button aria-label="Buscar funciones" title="Buscar funciones" onClick={() => openDirectory()}><Search /></button>
            <button aria-label="Control del vehículo" title="Control del vehículo" aria-pressed={selection?.id === "vehicle-control"} onClick={() => openModule("vehicle-control")}><SlidersHorizontal /></button>
            <button aria-label="Notificaciones" title="Notificaciones" aria-pressed={selection?.id === "notifications"} onClick={() => openModule("notifications")}><Bell /></button>
            <button aria-label="Ajustes rápidos" title="Ajustes rápidos" aria-pressed={selection?.id === "quick"} onClick={() => openModule("quick")}><Settings /></button>
            <button aria-label="Tablero simplificado" title="Tablero simplificado" aria-pressed={simple} onClick={() => setSimple((value) => !value)}><Gauge /></button>
          </div>
        </header>

        <main className={`cockpit-workspace ${selection ? "has-panel" : ""}`}>
          <Suspense fallback={<div className="cockpit-loading" role="status">Cargando tablero…</div>}>
            <DashboardPanel vehicleData={vehicle.vehicleData} currentGear={vehicle.currentGear} compact={Boolean(selection)} simple={simple} onOpenModule={openModule} />
          </Suspense>
          <SystemPanel selection={selection} visited={visited} moduleProps={{ ...vehicle, disabled: !isLandscape }} onSelect={openModule} onDirectory={openDirectory} onClose={closePanel} />
        </main>

        <nav className="system-bar" aria-label="Sistemas del vehículo">
          {systemGroups.map(({ id, name, description, icon: Icon }, index) => (
            <button key={id} data-testid={`category-${id}`} aria-pressed={selectedGroup === id} onClick={() => openDirectory(id)}>
              <Icon aria-hidden="true" /><span><strong>{name}</strong><small>{description}</small></span><span className="category-number">0{index + 1}</span>
            </button>
          ))}
        </nav>
      </div>
      {!isLandscape && <div className="orientation-notice" role="alert"><RotateCcw size={36} /><h1>Gira tu dispositivo</h1><p>El tablero se utiliza en horizontal.</p><small>Tus ajustes se conservan al girar.</small></div>}
    </div>
  );
}
