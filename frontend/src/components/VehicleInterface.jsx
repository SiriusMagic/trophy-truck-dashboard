import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  Gauge, 
  Battery, 
  Thermometer, 
  Zap, 
  Car, 
  Settings,
  Save,
  RotateCcw,
  Eye,
  Shield,
  Mountain,
  Radar,
  Activity,
  AlertTriangle,
  Zap as Lightning,
  Moon,
  FlameKindling,
  ArrowUp,
  ArrowDown,
  Compass,
  Target,
  Brain,
  Snowflake,
  Heart,
  Sparkles,
  ArrowLeftRight,
  Leaf,
  Menu,
  X,
  ChevronRight,
  DoorOpen,
  UserX,
  CircleDot,
  Move,
  MapPin,
  Wind
} from 'lucide-react';
import { mockData, presetConfigs, suspensionModes, driveProfiles } from '../data/mockData';
import { useToast } from '../hooks/use-toast';
import SuspensionControl from './SuspensionControl';
import SituationalAwareness from './SituationalAwareness'; 
import VirtualTransmission from './VirtualTransmission';
import AdvancedDiagnostics from './AdvancedDiagnostics';
import PowerControlSystem from './PowerControlSystem';
import SmartVehicleControl from './SmartVehicleControl';
import ComfortSystems from './ComfortSystems';
import AdvancedDriving from './AdvancedDriving';
import TractionControl from './TractionControl';
import AutonomyControl from './AutonomyControl';
import TreeRSystem from './TreeRSystem';
import ReconnaissanceSystem from './ReconnaissanceSystem';
import CodesSystem from './CodesSystem';
import SecuritySystem from './SecuritySystem';
import TireSystem from './TireSystem';
import UVHygienizationSystem from './UVHygienizationSystem';
import ParameterMonitoringSystem from './ParameterMonitoringSystem';
import CompressorSystem from './CompressorSystem';
import EnhancedTireSystem from './EnhancedTireSystem';
import CrabModeSystem from './CrabModeSystem';
import VidenSystem from './VidenSystem';
import GeocercasSystem from './GeocercasSystem';
import AerodinamicaSystem from './AerodinamicaSystem';
import FuturisticInterface from './FuturisticInterface';

const VehicleInterface = () => {
  // Panel deslizante state
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // Security system state
  const [securityStatus, setSecurityStatus] = useState({
    openDoors: [],
    unbuckledBelts: [],
    hasSecurityIssues: false
  });
  
  // Vehicle state
  const [vehicleData, setVehicleData] = useState(mockData);
  const [driveMode, setDriveMode] = useState('AWD');
  const [powerControlMode, setPowerControlMode] = useState('axle'); // 'axle', 'individual', 'ai'
  const [powerDistribution, setPowerDistribution] = useState([60, 40]);
  const [motorControls, setMotorControls] = useState({
    rear: { voltage: 400, amperage: 150 },
    front: { voltage: 380, amperage: 120 }
  });
  const [individualMotorControls, setIndividualMotorControls] = useState({
    rearLeft: { voltage: 400, amperage: 150 },
    rearRight: { voltage: 400, amperage: 150 },
    frontLeft: { voltage: 380, amperage: 120 },
    frontRight: { voltage: 380, amperage: 120 }
  });
  const [aiPowerActive, setAiPowerActive] = useState(false);
  const [savedConfigs, setSavedConfigs] = useState(presetConfigs);
  const [activeConfig, setActiveConfig] = useState('Custom');
  const [currentGear, setCurrentGear] = useState(2);
  const [driveProfile, setDriveProfile] = useState('Normal');
  const [overdrive, setOverdrive] = useState(false);
  const [hibernationMode, setHibernationMode] = useState(false);
  const [regenMode, setRegenMode] = useState('Standard');
  const { toast } = useToast();

  // Secciones del panel lateral
  const sections = [
    { id: 'reconnaissance', name: 'Reconocimiento', icon: Eye, color: 'sky' },
    { id: 'security', name: 'Seguridad', icon: Shield, color: 'red' },
    { id: 'crab-mode', name: 'Modo Cangrejo', icon: Move, color: 'orange' },
    { id: 'viden', name: 'Viden', icon: Shield, color: 'cyan' },
    { id: 'geocercas', name: 'Geocercas', icon: MapPin, color: 'teal' },
    { id: 'aerodinamica', name: 'Aerodinámica', icon: Wind, color: 'sky' },
    { id: 'futuristic', name: 'Vista Futurista', icon: Car, color: 'indigo' },
    { id: 'tires', name: 'Neumáticos', icon: CircleDot, color: 'orange' },
    { id: 'enhanced-tires', name: 'Neumáticos Pro', icon: Target, color: 'purple' },
    { id: 'compressor', name: 'Compresor', icon: ArrowUp, color: 'blue' },
    { id: 'uv-hygiene', name: 'Higienización UV', icon: Sparkles, color: 'purple' },
    { id: 'monitoring', name: 'Monitoreo', icon: Activity, color: 'green' },
    { id: 'codes', name: 'Códigos', icon: AlertTriangle, color: 'amber' },
    { id: 'treer', name: 'TreeR', icon: Leaf, color: 'green' },
    { id: 'autonomy', name: 'Autonomía', icon: Battery, color: 'pink' },
    { id: 'traction', name: 'Tracción', icon: ArrowLeftRight, color: 'teal' },
    { id: 'smart', name: 'Inteligente', icon: Sparkles, color: 'purple' },
    { id: 'comfort', name: 'Confort', icon: Settings, color: 'indigo' },
    { id: 'driving', name: 'Conducción', icon: Car, color: 'emerald' },
    { id: 'power', name: 'Potencia', icon: Zap, color: 'yellow' },
    { id: 'suspension', name: 'Suspensión', icon: Mountain, color: 'orange' },
    { id: 'awareness', name: 'Sensores', icon: Radar, color: 'green' },
    { id: 'diagnostics', name: 'Diagnósticos', icon: Activity, color: 'red' }
  ];

  // Función para abrir sección en panel lateral
  const openSection = (sectionId) => {
    setActiveSection(sectionId);
    setSidePanelOpen(true);
  };

  // Función para cerrar panel lateral
  const closeSidePanel = () => {
    setSidePanelOpen(false);
  };

  // Función para manejar cambios de estado de seguridad
  const handleSecurityStatusChange = useCallback((status) => {
    setSecurityStatus(status);
  }, []);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hibernationMode) {
        setVehicleData(prev => ({
          ...prev,
          speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 3),
          batteryTemp: prev.batteryTemp + (Math.random() - 0.5) * 0.8,
          torque: powerControlMode === 'ai' && aiPowerActive ? 
            450 + (Math.random() - 0.5) * 50 :
            (motorControls.rear.amperage + motorControls.front.amperage) + (Math.random() - 0.5) * 15,
          // Update odometer and trip meter based on speed
          odometer: prev.odometer ? prev.odometer + (prev.speed / 3600) : 12847.1,
          tripMeter: prev.tripMeter ? prev.tripMeter + (prev.speed / 3600) : 156.3,
          gForce: {
            x: (Math.random() - 0.5) * 2,
            y: (Math.random() - 0.5) * 1.5,
            z: (Math.random() - 0.5) * 0.8
          },
          pitch: (Math.random() - 0.5) * 20,
          roll: (Math.random() - 0.5) * 15,
          tirePressure: {
            fl: 32 + (Math.random() - 0.5) * 2,
            fr: 32 + (Math.random() - 0.5) * 2,
            rl: 33 + (Math.random() - 0.5) * 2,
            rr: 33 + (Math.random() - 0.5) * 2
          }
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [motorControls, hibernationMode, powerControlMode, aiPowerActive]);

  const handlePowerControlModeChange = (mode) => {
    setPowerControlMode(mode);
    setActiveConfig('Custom');
    
    let description = '';
    switch(mode) {
      case 'axle':
        description = 'Control por ejes delantero y trasero';
        break;
      case 'individual':
        description = 'Control independiente de cada motor';
        break;
      case 'ai':
        description = 'IA gestiona la potencia automáticamente';
        break;
    }
    
    toast({
      title: `Modo de potencia: ${mode.toUpperCase()}`,
      description: description,
    });
  };

  const handleAiPowerToggle = () => {
    setAiPowerActive(!aiPowerActive);
    if (!aiPowerActive) {
      // AI takes control
      setPowerDistribution([70, 30]);
      setMotorControls({
        rear: { voltage: 520, amperage: 220 },
        front: { voltage: 480, amperage: 180 }
      });
      toast({
        title: "🧠 IA ACTIVADA",
        description: "Sistema inteligente optimizando potencia en tiempo real",
      });
    } else {
      toast({
        title: "IA desactivada",
        description: "Control manual restaurado",
      });
    }
  };

  const handleDriveProfileChange = (profile) => {
    setDriveProfile(profile);
    const profileConfig = driveProfiles.find(p => p.name === profile);
    
    if (profileConfig) {
      setMotorControls(profileConfig.motorControls);
      setPowerDistribution(profileConfig.powerDistribution);
      setDriveMode(profileConfig.driveMode);
    }
    
    toast({
      title: `Modo ${profile} activado`,
      description: profileConfig?.description || "Configuración aplicada",
    });
  };

  const handleOverdriveToggle = () => {
    setOverdrive(!overdrive);
    if (!overdrive) {
      // Boost power for 30 seconds
      setMotorControls(prev => ({
        rear: { voltage: Math.min(600, prev.rear.voltage + 100), amperage: Math.min(300, prev.rear.amperage + 50) },
        front: { voltage: Math.min(600, prev.front.voltage + 100), amperage: Math.min(300, prev.front.amperage + 50) }
      }));
      
      // Boost bionic cooling
      setBionicCooling(prev => ({ ...prev, pulseRate: 120, arterialPressure: 95 }));
      
      setTimeout(() => {
        setOverdrive(false);
        setBionicCooling(prev => ({ ...prev, pulseRate: 72, arterialPressure: 85 }));
        toast({
          title: "Overdrive desactivado",
          description: "Potencia y refrigeración restauradas",
        });
      }, 30000);
      
      toast({
        title: "⚡ OVERDRIVE + CRIOGÉNICO ACTIVADO",
        description: "Potencia máxima con refrigeración biónica acelerada",
      });
    }
  };

  const handleHibernationToggle = () => {
    setHibernationMode(!hibernationMode);
    setBionicCooling(prev => ({ 
      ...prev, 
      active: hibernationMode, 
      pulseRate: hibernationMode ? 72 : 20 
    }));
    toast({
      title: hibernationMode ? "Despertar del hibernación" : "Modo hibernación activado",
      description: hibernationMode ? "Todos los sistemas activos" : "Sistemas en modo de bajo consumo",
    });
  };

  const handleRegenModeChange = (mode) => {
    setRegenMode(mode);
    toast({
      title: `Regeneración ${mode}`,
      description: mode === 'Aggressive' ? "Freno de motor activado" : "Regeneración estándar",
    });
  };

  const handleDriveModeChange = (mode) => {
    setDriveMode(mode);
    if (mode === 'FWD') {
      setPowerDistribution([0, 100]);
    } else if (mode === 'RWD') {
      setPowerDistribution([100, 0]);
    } else {
      setPowerDistribution([60, 40]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-6 p-4">
        
        {/* Header with Status Indicators */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
            TROPHY TRUCK ELÉCTRICO - SISTEMA INTELIGENTE
          </h1>
          <div className="flex justify-center space-x-4 mb-4">
            <Badge variant={hibernationMode ? "destructive" : "default"} className="text-sm">
              {hibernationMode ? "HIBERNACIÓN" : "ACTIVO"}
            </Badge>
            <Badge variant={overdrive ? "destructive" : "outline"} className="text-sm">
              {overdrive ? "⚡ OVERDRIVE" : "NORMAL"}
            </Badge>
            <Badge variant={bionicCooling.active ? "default" : "destructive"} className="text-sm">
              {bionicCooling.active ? "❄️ CRIOGÉNICO" : "ENFRIAMIENTO OFF"}
            </Badge>
            <Badge variant="outline" className="text-sm">
              POTENCIA: {powerControlMode.toUpperCase()}
            </Badge>
            <Badge variant={aiPowerActive ? "destructive" : "outline"} className="text-sm">
              {aiPowerActive ? "🧠 IA ACTIVA" : "MANUAL"}
            </Badge>
            
            {/* Indicadores de Seguridad */}
            {securityStatus.hasSecurityIssues && (
              <>
                {securityStatus.openDoors.length > 0 && (
                  <Badge variant="destructive" className="text-sm animate-pulse">
                    <DoorOpen className="w-3 h-3 mr-1" />
                    {securityStatus.openDoors.length} PUERTA(S)
                  </Badge>
                )}
                {securityStatus.unbuckledBelts.length > 0 && (
                  <Badge variant="destructive" className="text-sm animate-pulse">
                    <UserX className="w-3 h-3 mr-1" />
                    {securityStatus.unbuckledBelts.length} CINTURÓN(ES)
                  </Badge>
                )}
              </>
            )}
          </div>
        </div>

        {/* Emergency Controls */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Button 
            variant={overdrive ? "destructive" : "outline"}
            onClick={handleOverdriveToggle}
            disabled={hibernationMode}
            className="h-16 text-lg font-bold"
          >
            <Lightning className="w-6 h-6 mr-2" />
            {overdrive ? "OVERDRIVE ACTIVO" : "OVERDRIVE"}
          </Button>
          
          <Button 
            variant={hibernationMode ? "default" : "outline"}
            onClick={handleHibernationToggle}
            className="h-16 text-lg"
          >
            <Moon className="w-6 h-6 mr-2" />
            {hibernationMode ? "DESPERTAR" : "HIBERNAR"}
          </Button>
          
          <Button 
            variant={regenMode === 'Aggressive' ? "destructive" : "outline"}
            onClick={() => handleRegenModeChange(regenMode === 'Aggressive' ? 'Standard' : 'Aggressive')}
            disabled={hibernationMode}
            className="h-16 text-lg"
          >
            <FlameKindling className="w-6 h-6 mr-2" />
            REGEN {regenMode.toUpperCase()}
          </Button>
          
          <Button 
            variant={bionicCooling.active ? "default" : "destructive"}
            onClick={() => setBionicCooling(prev => ({ ...prev, active: !prev.active }))}
            disabled={hibernationMode}
            className="h-16 text-lg"
          >
            <Snowflake className="w-6 h-6 mr-2" />
            CRIOGÉNICO
          </Button>
          
          <div className="grid grid-cols-3 gap-1">
            {driveProfiles.map((profile) => (
              <Button
                key={profile.name}
                variant={driveProfile === profile.name ? "default" : "outline"}
                onClick={() => handleDriveProfileChange(profile.name)}
                disabled={hibernationMode}
                className="h-16 text-xs font-bold"
              >
                {profile.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          
          {/* Speed & Battery Status */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Gauge className="w-8 h-8 text-cyan-400" />
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  VELOCIDAD
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">
                  {Math.round(vehicleData.speed)} km/h
                </div>
                <Progress value={vehicleData.speed} max={200} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Battery Status */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Battery className="w-8 h-8 text-green-400" />
                <Badge variant="outline" className="text-green-400 border-green-400">
                  BATERÍA
                </Badge>
              </div>
              <div className="space-y-3">
                <div className="text-2xl font-bold text-green-400">
                  {vehicleData.batteryLevel}%
                </div>
                <Progress value={vehicleData.batteryLevel} className="h-2" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Temp:</span>
                    <span className={`flex items-center ${
                      bionicCooling.active ? 'text-blue-400' : 'text-orange-400'
                    }`}>
                      <Thermometer className="w-4 h-4 mr-1" />
                      {Math.round(vehicleData.batteryTemp)}°C
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Autonomía:</span>
                    <span className="text-cyan-400 font-bold">
                      {Math.round((vehicleData.batteryLevel / 100) * 750)} km
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Km Recorridos */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Compass className="w-8 h-8 text-purple-400" />
                <Badge variant="outline" className="text-purple-400 border-purple-400">
                  KILOMETRAJE
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total:</span>
                  <span className="text-purple-400 font-bold">
                    {vehicleData.odometer?.toLocaleString() || '12,847'} km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Viaje:</span>
                  <span className="text-cyan-400 font-bold">
                    {vehicleData.tripMeter?.toFixed(1) || '156.3'} km
                  </span>
                </div>
                <div className="text-center mt-3">
                  <div className="text-xs text-slate-500">
                    Promedio: {((vehicleData.tripMeter || 156.3) / 2.5).toFixed(1)} km/día
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bionic Cooling Status */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Snowflake className="w-8 h-8 text-blue-400" />
                <Badge variant="outline" className="text-blue-400 border-blue-400">
                  CRIOGÉNICO
                </Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Temp. Crio:</span>
                  <span className="text-blue-400">{bionicCooling.temperature.toFixed(1)}°C</span>
                </div>
                <div className="flex justify-between">
                  <span>Pulso:</span>
                  <span className="text-purple-400 flex items-center">
                    <Heart className="w-4 h-4 mr-1" />
                    {bionicCooling.pulseRate} BPM
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Presión:</span>
                  <span className="text-cyan-400">{bionicCooling.arterialPressure}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Torque & AI Status */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Zap className="w-8 h-8 text-yellow-400" />
                <Badge variant="outline" className={aiPowerActive ? "text-purple-400 border-purple-400" : "text-yellow-400 border-yellow-400"}>
                  {aiPowerActive ? "IA TORQUE" : "TORQUE"}
                </Badge>
              </div>
              <div className="text-center">
                <div className={`text-3xl font-bold mb-2 ${aiPowerActive ? 'text-purple-400' : 'text-yellow-400'}`}>
                  {Math.round(vehicleData.torque)} Nm
                </div>
                <Progress value={vehicleData.torque} max={500} className="h-2" />
                {aiPowerActive && (
                  <div className="text-xs text-purple-400 mt-2 flex items-center justify-center">
                    <Brain className="w-4 h-4 mr-1" />
                    IA optimizando
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sistema de navegación por secciones */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-cyan-400">Sistemas del Vehículo</h3>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                {sections.length} SISTEMAS DISPONIBLES
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant="outline"
                  onClick={() => openSection(section.id)}
                  disabled={hibernationMode}
                  className={`h-16 flex flex-col space-y-1 hover:bg-${section.color}-600/20 border-slate-600 hover:border-${section.color}-500`}
                >
                  <section.icon className={`w-6 h-6 text-${section.color}-400`} />
                  <span className="text-xs font-semibold">{section.name}</span>
                  <ChevronRight className="w-3 h-3 text-slate-500" />
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel Deslizante Derecho */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-slate-950/95 backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-50 ${
        sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header del panel */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            {sections.find(s => s.id === activeSection) && 
              (() => {
                const section = sections.find(s => s.id === activeSection);
                const IconComponent = section.icon;
                return <IconComponent className={`w-6 h-6 text-${section.color}-400`} />;
              })()
            }
            <h2 className="text-xl font-semibold text-white">
              {sections.find(s => s.id === activeSection)?.name || 'Sistema'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeSidePanel}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Contenido del panel */}
        <div className="p-6 h-full overflow-y-auto">
          {activeSection === 'reconnaissance' && (
            <ReconnaissanceSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'security' && (
            <SecuritySystem 
              vehicleData={vehicleData} 
              disabled={hibernationMode} 
              onSecurityStatusChange={handleSecurityStatusChange}
            />
          )}
          {activeSection === 'crab-mode' && (
            <CrabModeSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'viden' && (
            <VidenSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'geocercas' && (
            <GeocercasSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'aerodinamica' && (
            <AerodinamicaSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'futuristic' && (
            <FuturisticInterface vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'tires' && (
            <TireSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'enhanced-tires' && (
            <EnhancedTireSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'compressor' && (
            <CompressorSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'uv-hygiene' && (
            <UVHygienizationSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'monitoring' && (
            <ParameterMonitoringSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'codes' && (
            <CodesSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'treer' && (
            <TreeRSystem vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'autonomy' && (
            <AutonomyControl vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'traction' && (
            <TractionControl disabled={hibernationMode} />
          )}
          {activeSection === 'smart' && (
            <SmartVehicleControl vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'comfort' && (
            <ComfortSystems vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'driving' && (
            <AdvancedDriving vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'power' && (
            <PowerControlSystem 
              powerControlMode={powerControlMode}
              setPowerControlMode={handlePowerControlModeChange}
              powerDistribution={powerDistribution}
              setPowerDistribution={setPowerDistribution}
              motorControls={motorControls}
              setMotorControls={setMotorControls}
              individualMotorControls={individualMotorControls}
              setIndividualMotorControls={setIndividualMotorControls}
              aiPowerActive={aiPowerActive}
              setAiPowerActive={handleAiPowerToggle}
              disabled={hibernationMode}
            />
          )}
          {activeSection === 'cooling' && (
            <BionicCooling 
              bionicCooling={bionicCooling}
              setBionicCooling={setBionicCooling}
              vehicleData={vehicleData}
              disabled={hibernationMode}
            />
          )}
          {activeSection === 'suspension' && (
            <SuspensionControl disabled={hibernationMode} />
          )}
          {activeSection === 'awareness' && (
            <SituationalAwareness vehicleData={vehicleData} disabled={hibernationMode} />
          )}
          {activeSection === 'diagnostics' && (
            <AdvancedDiagnostics vehicleData={vehicleData} motorControls={motorControls} disabled={hibernationMode} />
          )}
        </div>
      </div>

      {/* Overlay cuando el panel está abierto */}
      {sidePanelOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidePanel}
        />
      )}
    </div>
  );
};

export default VehicleInterface;