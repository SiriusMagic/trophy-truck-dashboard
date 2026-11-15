import { lazy } from "react";
import {
  Activity, ArrowLeftRight, ArrowUp, Battery, Bell, Car, CircleDot,
  Gauge, Leaf, Mountain, Move, Radar, Settings, Shield, SlidersHorizontal,
  Sparkles, Target, TriangleAlert, Wind,
} from "lucide-react";

// Un catálogo para la barra, el buscador y la carga diferida de controles.
export const systemGroups = [
  { id: "driving", name: "Conducción", description: "Chasis, ruedas y terreno", icon: Car },
  { id: "energy", name: "Energía", description: "Motores y autonomía", icon: Battery },
  { id: "safety", name: "Seguridad", description: "Protección y sensores", icon: Shield },
  { id: "comfort", name: "Confort", description: "Cabina y asistencia", icon: Sparkles },
  { id: "diagnostics", name: "Estado", description: "Monitoreo y diagnóstico", icon: Activity },
];

export const systemModules = [
  { id: "driving", group: "driving", name: "Conducción", description: "Perfiles y motores de rueda", icon: Car, component: lazy(() => import("../components/AdvancedDriving")) },
  { id: "crab-mode", group: "driving", name: "Modo Cangrejo", description: "Dirección en las cuatro ruedas", icon: Move, component: lazy(() => import("../components/CrabModeSystem")) },
  { id: "aerodinamica", group: "driving", name: "Aerodinámica", description: "Alerones y flujo de aire", icon: Wind, component: lazy(() => import("../components/AerodinamicaSystem")) },
  { id: "tires", group: "driving", name: "Neumáticos", description: "Presión por eje y rueda", icon: CircleDot, component: lazy(() => import("../components/TireSystem")) },
  { id: "enhanced-tires", group: "driving", name: "Neumáticos Pro", description: "Presión avanzada y alertas", icon: Target, component: lazy(() => import("../components/EnhancedTireSystem")) },
  { id: "traction", group: "driving", name: "Tracción", description: "Distribución y agarre", icon: ArrowLeftRight, component: lazy(() => import("../components/TractionControl")) },
  { id: "suspension", group: "driving", name: "Suspensión", description: "Altura y rigidez del chasis", icon: Mountain, component: lazy(() => import("../components/SuspensionControl")) },
  { id: "transmission", group: "driving", name: "Transmisión", description: "Marchas y entrega de par", icon: Gauge, component: lazy(() => import("../components/VirtualTransmission")) },
  { id: "power", group: "energy", name: "Potencia", description: "Voltaje, amperaje y reparto", icon: Battery, component: lazy(() => import("../components/PowerControlSystem")) },
  { id: "autonomy", group: "energy", name: "Autonomía", description: "Batería y consumo", icon: Battery, component: lazy(() => import("../components/AutonomyControl")) },
  { id: "compressor", group: "energy", name: "Compresor", description: "Presión y refrigeración", icon: ArrowUp, component: lazy(() => import("../components/CompressorSystem")) },
  { id: "security", group: "safety", name: "Seguridad", description: "Protección del vehículo", icon: Shield, component: lazy(() => import("../components/SecuritySystem")) },
  { id: "viden", group: "safety", name: "Viden", description: "Autenticación biométrica", icon: Shield, component: lazy(() => import("../components/VidenSystem")) },
  { id: "awareness", group: "safety", name: "Sensores", description: "Entorno y conciencia situacional", icon: Radar, component: lazy(() => import("../components/SituationalAwareness")) },
  { id: "codes", group: "safety", name: "Códigos", description: "Alertas y códigos de fallo", icon: TriangleAlert, component: lazy(() => import("../components/CodesSystem")) },
  { id: "comfort", group: "comfort", name: "Confort", description: "Asientos, cristales y cabina", icon: Settings, component: lazy(() => import("../components/ComfortSystems")) },
  { id: "uv-hygiene", group: "comfort", name: "Higienización UV", description: "Ciclos de limpieza", icon: Sparkles, component: lazy(() => import("../components/UVHygienizationSystem")) },
  { id: "smart", group: "comfort", name: "Inteligente", description: "Puertas, perfiles y asistencia", icon: Sparkles, component: lazy(() => import("../components/SmartVehicleControl")) },
  { id: "treer", group: "comfort", name: "TreeR", description: "Servicios y recursos del vehículo", icon: Leaf, component: lazy(() => import("../components/TreeRSystem")) },
  { id: "monitoring", group: "diagnostics", name: "Monitoreo", description: "Parámetros en tiempo real", icon: Activity, component: lazy(() => import("../components/ParameterMonitoringSystem")) },
  { id: "diagnostics", group: "diagnostics", name: "Diagnósticos", description: "Salud de motores y batería", icon: Activity, component: lazy(() => import("../components/AdvancedDiagnostics")) },
];

export const auxiliaryModules = [
  { id: "quick", name: "Ajustes rápidos", icon: Settings, component: lazy(() => import("../components/QuickSettingsPanel")) },
  { id: "notifications", name: "Notificaciones", icon: Bell, component: lazy(() => import("../components/NotificationsPanel")) },
  { id: "vehicle-control", name: "Control del vehículo", icon: SlidersHorizontal, component: lazy(() => import("../components/VehicleControlPanel")) },
];
export const allModules = [...systemModules, ...auxiliaryModules];
export const normalizeSearch = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
