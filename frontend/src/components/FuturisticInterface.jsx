import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Eye, Shield, Move, MapPin, Wind, CircleDot, Target, ArrowUp, Sparkles, Activity,
  AlertTriangle, Leaf, Battery, ArrowLeftRight, Settings, Car, Heart, Mountain, Radar,
  Gauge, RotateCcw, Smartphone
} from "lucide-react";
import ReconnaissanceSystem from "./ReconnaissanceSystem";
import SecuritySystem from "./SecuritySystem";
import CrabModeSystem from "./CrabModeSystem";
import VidenSystem from "./VidenSystem";
import GeocercasSystem from "./GeocercasSystem";
import AerodinamicaSystem from "./AerodinamicaSystem";
import TireSystem from "./TireSystem";
import EnhancedTireSystem from "./EnhancedTireSystem";
import CompressorSystem from "./CompressorSystem";
import UVHygienizationSystem from "./UVHygienizationSystem";
import ParameterMonitoringSystem from "./ParameterMonitoringSystem";
import CodesSystem from "./CodesSystem";
import TreeRSystem from "./TreeRSystem";
import AutonomyControl from "./AutonomyControl";
import TractionControl from "./TractionControl";
import SmartVehicleControl from "./SmartVehicleControl";
import ComfortSystems from "./ComfortSystems";
import AdvancedDriving from "./AdvancedDriving";
import PowerControlSystem from "./PowerControlSystem";
import BionicCooling from "./BionicCooling";
import SuspensionControl from "./SuspensionControl";
import SituationalAwareness from "./SituationalAwareness";
import AdvancedDiagnostics from "./AdvancedDiagnostics";
import VirtualTransmission from "./VirtualTransmission";
import { mockData } from "../data/mockData";
import DashboardPanel from "./DashboardPanel";
import MinimalDriverDashboard from "./MinimalDriverDashboard";
import QuickSettingsPanel from "./QuickSettingsPanel";
import NotificationsPanel from "./NotificationsPanel";
import VehicleControlPanel from "./VehicleControlPanel";

const FuturisticInterface = () => {
  const [isLandscape, setIsLandscape] = useState(() => window.innerWidth > window.innerHeight);
  useEffect(() => {
    const onResize = () => setIsLandscape(window.innerWidth > window.innerHeight);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("orientationchange", onResize); };
  }, []);

  const [vehicleData] = useState(mockData);
  const [powerControlMode, setPowerControlMode] = useState("axle");
  const [powerDistribution, setPowerDistribution] = useState([60, 40]);
  const [motorControls, setMotorControls] = useState({ rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } });
  const [individualMotorControls, setIndividualMotorControls] = useState({ rearLeft: { voltage: 400, amperage: 150 }, rearRight: { voltage: 400, amperage: 150 }, frontLeft: { voltage: 380, amperage: 120 }, frontRight: { voltage: 380, amperage: 120 } });
  const [aiPowerActive, setAiPowerActive] = useState(false);
  const [currentGear, setCurrentGear] = useState(2);
  const [bionicCooling, setBionicCooling] = useState({
    active: false,
    temperature: 25,
    mode: 'normal',
    efficiency: 85
  });

  const sections = useMemo(() => [
    { id: "reconnaissance", name: "Reconocimiento", icon: Eye },
    { id: "security", name: "Seguridad", icon: Shield },
    { id: "crab-mode", name: "Modo Cangrejo", icon: Move },
    { id: "viden", name: "Viden", icon: Shield },
    { id: "geocercas", name: "Geocercas", icon: MapPin },
    { id: "aerodinamica", name: "Aerodinámica", icon: Wind },
    { id: "tires", name: "Neumáticos", icon: CircleDot },
    { id: "enhanced-tires", name: "Neumáticos Pro", icon: Target },
    { id: "compressor", name: "Compresor", icon: ArrowUp },
    { id: "uv-hygiene", name: "Higienización UV", icon: Sparkles },
    { id: "monitoring", name: "Monitoreo", icon: Activity },
    { id: "codes", name: "Códigos", icon: AlertTriangle },
    { id: "treer", name: "TreeR", icon: Leaf },
    { id: "autonomy", name: "Autonomía", icon: Battery },
    { id: "traction", name: "Tracción", icon: ArrowLeftRight },
    { id: "smart", name: "Inteligente", icon: Sparkles },
    { id: "comfort", name: "Confort", icon: Settings },
    { id: "driving", name: "Conducción", icon: Car },
    { id: "power", name: "Potencia", icon: Battery },
    { id: "cooling", name: "Criogénico", icon: Heart },
    { id: "suspension", name: "Suspensión", icon: Mountain },
    { id: "awareness", name: "Sensores", icon: Radar },
    { id: "diagnostics", name: "Diagnósticos", icon: Activity },
    { id: "transmission", name: "Transmisión", icon: Gauge }
  ], []);

  const [activeSection, setActiveSection] = useState(null);
  const leftOpen = true;

  const [showMinimal, setShowMinimal] = useState(false);
  const [panelOpen, setPanelOpen] = useState(null); // 'notifications' | 'quick' | null
  const [bottomOpen, setBottomOpen] = useState(false);

  const common = { vehicleData, disabled: !isLandscape };

  const renderActive = () => {
    if (!activeSection) return (
      <DashboardPanel
        onOpenNotifications={() => setPanelOpen('notifications')}
        onOpenQuickSettings={() => setPanelOpen('quick')}
        onOpenVehicleControl={() => setBottomOpen(true)}
        onOpenMinimalDashboard={() => setShowMinimal(true)}
      />
    );
    switch (activeSection) {
      case "reconnaissance": return <ReconnaissanceSystem {...common} />;
      case "security": return <SecuritySystem {...common} />;
      case "crab-mode": return <CrabModeSystem {...common} />;
      case "viden": return <VidenSystem />;
      case "geocercas": return <GeocercasSystem />;
      case "aerodinamica": return <AerodinamicaSystem />;
      case "tires": return <TireSystem {...common} />;
      case "enhanced-tires": return <EnhancedTireSystem {...common} />;
      case "compressor": return <CompressorSystem {...common} />;
      case "uv-hygiene": return <UVHygienizationSystem {...common} />;
      case "monitoring": return <ParameterMonitoringSystem {...common} />;
      case "codes": return <CodesSystem {...common} />;
      case "treer": return <TreeRSystem {...common} />;
      case "autonomy": return <AutonomyControl {...common} />;
      case "traction": return <TractionControl {...common} />;
      case "smart": return <SmartVehicleControl {...common} />;
      case "comfort": return <ComfortSystems {...common} />;
      case "driving": return <AdvancedDriving {...common} />;
      case "power": return (
        <PowerControlSystem
          powerControlMode={powerControlMode}
          setPowerControlMode={setPowerControlMode}
          powerDistribution={powerDistribution}
          setPowerDistribution={setPowerDistribution}
          motorControls={motorControls}
          setMotorControls={setMotorControls}
          individualMotorControls={individualMotorControls}
          setIndividualMotorControls={setIndividualMotorControls}
          aiPowerActive={aiPowerActive}
          setAiPowerActive={() => setAiPowerActive((v) => !v)}
          disabled={!isLandscape}
        />
      );
      case "cooling": return <BionicCooling {...common} />;
      case "suspension": return <SuspensionControl {...common} />;
      case "awareness": return <SituationalAwareness {...common} />;
      case "diagnostics": return <AdvancedDiagnostics {...common} motorControls={motorControls} />;
      case "transmission": return (
        <VirtualTransmission
          currentGear={currentGear}
          setCurrentGear={setCurrentGear}
          motorControls={motorControls}
          setMotorControls={setMotorControls}
          disabled={!isLandscape}
        />
      );
      default: return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-white overflow-hidden">
      {!isLandscape && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center text-center p-6">
          <div className="flex items-center gap-3 mb-4"><RotateCcw className="w-6 h-6 text-cyan-400" /><span className="text-xl font-semibold">Gira tu dispositivo</span></div>
          <div className="text-slate-300 mb-6">Esta experiencia funciona solo en orientación horizontal (landscape)</div>
          <div className="flex items-center gap-2 text-slate-400 text-sm"><Smartphone className="w-4 h-4" /> Bloqueo activo hasta girar a horizontal</div>
        </div>
      )}

      <div className="h-full w-full flex">
        <aside className="w-64 bg-slate-900/80 border-r border-slate-800 h-full flex flex-col">
          <div className="px-4 py-3 border-b border-slate-800">
            <div onClick={() => setActiveSection(null)} className="cursor-pointer select-none">
              <div className="text-lg font-bold">Trophy Truck</div>
              <div className="text-xs text-slate-400">Panel de Sistemas</div>
              <div className="text-[10px] text-cyan-400 mt-1">Click para Dashboard</div>
            </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-2 space-y-1">
            {sections.map((s) => {
              const Icon = s.icon; const active = s.id === activeSection;
              return (
                <button key={s.id} onClick={() => setActiveSection(s.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${active ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"}`}>
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{s.name}</span>
                </button>
              );
            })}
          </nav>
          <div className="px-3 py-2 text-xs text-slate-500 border-t border-slate-800">Horizontal obligatorio</div>
        </aside>
        <main className="flex-1 min-w-0 h-full overflow-y-auto"><div className="h-full p-3 sm:p-4">{renderActive()}</div></main>
      </div>

      <NotificationsPanel open={panelOpen === 'notifications'} onClose={() => setPanelOpen(null)} />
      <QuickSettingsPanel open={panelOpen === 'quick'} onClose={() => setPanelOpen(null)} />
      <VehicleControlPanel open={bottomOpen} onClose={() => setBottomOpen(false)} motorControls={motorControls} setMotorControls={setMotorControls} currentGear={currentGear} setCurrentGear={setCurrentGear} />

      {showMinimal && (<MinimalDriverDashboard currentGear={currentGear} motorControls={motorControls} onExit={() => setShowMinimal(false)} />)}
    </div>
  );
};

export default FuturisticInterface;