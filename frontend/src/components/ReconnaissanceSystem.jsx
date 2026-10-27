import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Plane,
  Map,
  Eye,
  Users,
  Car,
  Bike,
  AlertTriangle,
  Battery,
  Radar,
  Target,
  ArrowUp,
  Zap,
  Signal,
  Gauge,
  Video,
  Play,
  Pause,
  RotateCw,
  Maximize2,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ReconnaissanceSystem = ({ disabled }) => {
  const [roofHatch, setRoofHatch] = useState(false);
  const [dronesStatus, setDronesStatus] = useState({
    drone1: { 
      deployed: false, 
      battery: 95, 
      altitude: 0, 
      mission: 'standby',
      position: { x: 0, y: 0 }
    },
    drone2: { 
      deployed: false, 
      battery: 87, 
      altitude: 0, 
      mission: 'standby',
      position: { x: 0, y: 0 }
    }
  });
  
  const [missionType, setMissionType] = useState('reconnaissance');
  const [targetDrone, setTargetDrone] = useState('all'); // 'drone1', 'drone2', 'all'
  const [detectedObjects, setDetectedObjects] = useState([]);
  const [droneMap, setDroneMap] = useState({
    obstacles: [],
    terrain: [],
    roads: [],
    lastUpdate: null
  });
  const [energyTransfer, setEnergyTransfer] = useState([0]); // 0-100%
  
  const { toast } = useToast();

  // Simulate drone missions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!disabled) {
        // Update deployed drones
        setDronesStatus(prev => {
          const newStatus = { ...prev };
          
          Object.keys(newStatus).forEach(droneKey => {
            if (newStatus[droneKey].deployed) {
              // Consume battery
              newStatus[droneKey].battery = Math.max(0, newStatus[droneKey].battery - 0.5);
              
              // Update position
              newStatus[droneKey].position = {
                x: Math.random() * 200 - 100,
                y: Math.random() * 200 - 100
              };
              
              // Generate random detections
              if (Math.random() > 0.7) {
                const detectionTypes = ['person', 'car', 'motorcycle'];
                const detection = {
                  id: Date.now() + Math.random(),
                  type: detectionTypes[Math.floor(Math.random() * detectionTypes.length)],
                  distance: Math.round(Math.random() * 500 + 50),
                  bearing: Math.round(Math.random() * 360),
                  confidence: Math.round(Math.random() * 30 + 70),
                  drone: droneKey
                };
                
                setDetectedObjects(prev => [detection, ...prev.slice(0, 9)]);
              }
            }
          });
          
          return newStatus;
        });
        
        // Update drone map data
        if (Object.values(dronesStatus).some(drone => drone.deployed)) {
          setDroneMap(prev => ({
            ...prev,
            obstacles: [
              ...prev.obstacles.slice(0, 5),
              {
                type: 'pothole',
                position: { x: Math.random() * 100, y: Math.random() * 100 },
                severity: Math.random() > 0.5 ? 'high' : 'medium'
              }
            ],
            lastUpdate: new Date()
          }));
        }
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [dronesStatus, disabled]);

  const handleRoofHatchToggle = () => {
    setRoofHatch(!roofHatch);
    toast({
      title: roofHatch ? 'Compuerta cerrada' : 'Compuerta abierta',
      description: roofHatch ? 'Drones protegidos' : 'Drones listos para despliegue',
    });
  };

  const handleMissionDeployment = () => {
    if (!roofHatch) {
      toast({
        title: 'Error',
        description: 'Abrir compuerta primero',
      });
      return;
    }

    let dronesToDeploy = [];
    
    switch(targetDrone) {
      case 'drone1':
        dronesToDeploy = ['drone1'];
        break;
      case 'drone2':
        dronesToDeploy = ['drone2'];
        break;
      case 'all':
        dronesToDeploy = ['drone1', 'drone2'];
        break;
    }

    setDronesStatus(prev => {
      const newStatus = { ...prev };
      dronesToDeploy.forEach(drone => {
        newStatus[drone] = {
          ...prev[drone],
          deployed: true,
          altitude: 50,
          mission: missionType
        };
      });
      return newStatus;
    });

    const missionNames = {
      reconnaissance: 'Reconocimiento',
      mapping: 'Mapeo LIDAR',
      tracking: 'Seguimiento'
    };

    const targetNames = {
      drone1: 'Dron 1',
      drone2: 'Dron 2', 
      all: 'Ambos Drones'
    };

    toast({
      title: `Misión ${missionNames[missionType]} Iniciada`,
      description: `Enviada a: ${targetNames[targetDrone]}`,
    });
  };

  const handleDroneDeployment = (option) => {
    if (!roofHatch) {
      toast({
        title: 'Error',
        description: 'Abrir compuerta primero',
      });
      return;
    }

    let dronesToDeploy = [];
    
    switch(option) {
      case 'drone1':
        dronesToDeploy = ['drone1'];
        break;
      case 'drone2':
        dronesToDeploy = ['drone2'];
        break;
      case 'all':
        dronesToDeploy = ['drone1', 'drone2'];
        break;
    }

    setDronesStatus(prev => {
      const newStatus = { ...prev };
      dronesToDeploy.forEach(drone => {
        newStatus[drone] = {
          ...prev[drone],
          deployed: !prev[drone].deployed,
          altitude: prev[drone].deployed ? 0 : 50,
          mission: prev[drone].deployed ? 'standby' : missionType
        };
      });
      return newStatus;
    });

    toast({
      title: `Drones ${option === 'all' ? 'ambos' : option} ${dronesStatus[dronesToDeploy[0]].deployed ? 'retirados' : 'desplegados'}`,
      description: `Misión: ${missionType}`,
    });
  };

  const handleEnergyTransfer = (value) => {
    setEnergyTransfer(value);
    
    // Transfer energy from drones to vehicle
    const transferAmount = value[0];
    if (transferAmount > 0) {
      setDronesStatus(prev => {
        const newStatus = { ...prev };
        Object.keys(newStatus).forEach(drone => {
          if (newStatus[drone].deployed) {
            newStatus[drone].battery = Math.max(20, newStatus[drone].battery - transferAmount * 0.1);
          }
        });
        return newStatus;
      });
    }
  };

  const getObjectIcon = (type) => {
    switch(type) {
      case 'person': return <Users className="w-4 h-4 text-blue-400" />;
      case 'car': return <Car className="w-4 h-4 text-green-400" />;
      case 'motorcycle': return <Bike className="w-4 h-4 text-yellow-400" />;
      default: return <Target className="w-4 h-4 text-slate-400" />;
    }
  };

  const getDeployedCount = () => {
    return Object.values(dronesStatus).filter(drone => drone.deployed).length;
  };

  return (
    <div className="space-y-6">
      
      {/* Reconnaissance Control Header */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Plane className="w-8 h-8 text-cyan-400" />
              <h3 className="text-xl font-semibold text-cyan-400">
                Sistema de Reconocimiento Aéreo
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={roofHatch ? "default" : "outline-solid"}>
                {roofHatch ? "🚁 COMPUERTA ABIERTA" : "🔒 COMPUERTA CERRADA"}
              </Badge>
              <Badge variant={getDeployedCount() > 0 ? "destructive" : "outline-solid"}>
                {getDeployedCount()}/2 DRONES ACTIVOS
              </Badge>
            </div>
          </div>
          
          {/* Roof Hatch Control */}
          <div className="text-center">
            <Button
              variant={roofHatch ? "destructive" : "default"}
              onClick={handleRoofHatchToggle}
              disabled={disabled}
              className="h-16 w-64 text-lg font-bold"
            >
              <ArrowUp className="w-6 h-6 mr-2" />
              {roofHatch ? 'CERRAR COMPUERTA' : 'ABRIR COMPUERTA DEL TECHO'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Drone Deployment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Deployment Controls */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-6">
              Control de Despliegue
            </h4>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant={dronesStatus.drone1.deployed ? "destructive" : "outline-solid"}
                  onClick={() => handleDroneDeployment('drone1')}
                  disabled={disabled || !roofHatch}
                  className="h-16 flex flex-col"
                >
                  <Plane className="w-6 h-6 mb-1" />
                  <span className="text-xs">Dron 1</span>
                  <span className="text-xs text-slate-400">
                    {dronesStatus.drone1.battery}%
                  </span>
                </Button>
                
                <Button
                  variant={dronesStatus.drone2.deployed ? "destructive" : "outline-solid"}
                  onClick={() => handleDroneDeployment('drone2')}
                  disabled={disabled || !roofHatch}
                  className="h-16 flex flex-col"
                >
                  <Plane className="w-6 h-6 mb-1" />
                  <span className="text-xs">Dron 2</span>
                  <span className="text-xs text-slate-400">
                    {dronesStatus.drone2.battery}%
                  </span>
                </Button>
                
                <Button
                  variant={getDeployedCount() === 2 ? "destructive" : "outline-solid"}
                  onClick={() => handleDroneDeployment('all')}
                  disabled={disabled || !roofHatch}
                  className="h-16 flex flex-col"
                >
                  <Plane className="w-6 h-6 mb-1" />
                  <span className="text-xs">Todos</span>
                  <span className="text-xs text-slate-400">Escuadrón</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Type Selection */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-6">
              Configuración de Misión
            </h4>
            
            {/* Target Drone Selection */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-slate-300 mb-3">Enviar Misión A:</h5>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'drone1', label: 'Dron 1', desc: `Bat: ${dronesStatus.drone1.battery}%` },
                  { id: 'drone2', label: 'Dron 2', desc: `Bat: ${dronesStatus.drone2.battery}%` },
                  { id: 'all', label: 'Ambos', desc: 'Escuadrón' }
                ].map((target) => (
                  <Button
                    key={target.id}
                    variant={targetDrone === target.id ? "default" : "outline-solid"}
                    onClick={() => setTargetDrone(target.id)}
                    disabled={disabled}
                    className={`h-16 flex flex-col ${
                      targetDrone === target.id ? 'bg-blue-600' : ''
                    }`}
                  >
                    <Plane className="w-5 h-5 mb-1" />
                    <span className="text-xs font-semibold">{target.label}</span>
                    <span className="text-xs text-slate-400">{target.desc}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Mission Type Selection */}
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-slate-300 mb-3">Tipo de Misión:</h5>
              {[
                { id: 'reconnaissance', label: 'Reconocimiento', desc: 'Exploración y detección de objetivos', icon: Eye },
                { id: 'mapping', label: 'Mapeo', desc: 'Mapeo topográfico con LIDAR', icon: Map },
                { id: 'tracking', label: 'Seguimiento', desc: 'Seguimiento de objetivo específico', icon: Target }
              ].map((mission) => (
                <Button
                  key={mission.id}
                  variant={missionType === mission.id ? "default" : "outline-solid"}
                  onClick={() => setMissionType(mission.id)}
                  disabled={disabled}
                  className={`w-full justify-start h-12 ${
                    missionType === mission.id ? 'bg-green-600' : ''
                  }`}
                >
                  <mission.icon className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <div className="font-semibold">{mission.label}</div>
                    <div className="text-xs text-slate-400">{mission.desc}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Send Mission Button */}
            <div className="mt-6">
              <Button
                variant="default"
                onClick={() => handleMissionDeployment()}
                disabled={disabled || !roofHatch}
                className="w-full h-12 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                <Target className="w-5 h-5 mr-2" />
                Enviar Misión: {missionType.charAt(0).toUpperCase() + missionType.slice(1)} 
                {targetDrone === 'all' ? ' (Ambos Drones)' : targetDrone === 'drone1' ? ' (Dron 1)' : ' (Dron 2)'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pantalla de Control del Dron */}
      {getDeployedCount() > 0 && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Video className="w-8 h-8 text-blue-400" />
                <h4 className="text-xl font-semibold text-blue-400">
                  Pantalla de Control del Dron
                </h4>
              </div>
              <Badge variant="outline" className="text-blue-400 border-blue-400">
                {getDeployedCount()} DRON(ES) ACTIVO(S)
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Video en Vivo Simulado */}
              <div className="space-y-4">
                <h5 className="text-blue-300 font-semibold">Video en Vivo - Cámara Dron</h5>
                
                <div className="relative bg-slate-800/50 rounded-lg h-48 overflow-hidden border border-slate-600">
                  {/* Simulación de video con grid de puntos móviles */}
                  <div className="absolute inset-0 bg-linear-to-br from-slate-800 via-slate-700 to-slate-900">
                    {/* Simulación de terreno */}
                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-green-900/30 to-transparent"></div>
                    
                    {/* Puntos móviles simulando detecciones */}
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="absolute w-2 h-2 bg-red-400 rounded-full animate-pulse"
                        style={{
                          left: `${20 + i * 10}%`,
                          top: `${30 + Math.sin(Date.now() / 1000 + i) * 10}%`,
                          animationDelay: `${i * 0.2}s`
                        }}
                      ></div>
                    ))}
                    
                    {/* HUD overlay */}
                    <div className="absolute inset-4 border border-cyan-400/30 rounded">
                      <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono">
                        LIVE CAM | ALT: {Math.round(dronesStatus.drone1.altitude || 50)}m
                      </div>
                      <div className="absolute bottom-2 right-2 text-xs text-cyan-400 font-mono">
                        REC ● {new Date().toLocaleTimeString()}
                      </div>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-8 h-8 border-2 border-red-400 rounded-full animate-ping"></div>
                        <Target className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-2 left-2 flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Play className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Pause className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <RotateCw className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-6 w-6 p-0">
                      <Maximize2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Indicadores de Estado en Tiempo Real */}
              <div className="space-y-4">
                <h5 className="text-blue-300 font-semibold">Telemetría en Tiempo Real</h5>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Nivel de Batería */}
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <Battery className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-slate-400">BATERÍA</span>
                    </div>
                    <div className="text-lg font-bold text-green-400">
                      {Math.round((dronesStatus.drone1.battery + dronesStatus.drone2.battery) / 2)}%
                    </div>
                    <Progress 
                      value={(dronesStatus.drone1.battery + dronesStatus.drone2.battery) / 2} 
                      className="h-1 mt-1" 
                    />
                  </div>

                  {/* Intensidad de Señal */}
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <Signal className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-slate-400">SEÑAL</span>
                    </div>
                    <div className="text-lg font-bold text-cyan-400">
                      {Math.round(85 + Math.random() * 10)}%
                    </div>
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 h-3 rounded ${
                            i < 4 ? 'bg-cyan-400' : 'bg-slate-600'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Velocidad */}
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <Gauge className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-slate-400">VELOCIDAD</span>
                    </div>
                    <div className="text-lg font-bold text-yellow-400">
                      {Math.round(45 + Math.random() * 15)} km/h
                    </div>
                  </div>

                  {/* Altitud */}
                  <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-2">
                      <ArrowUp className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-400">ALTITUD</span>
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {Math.round(50 + Math.random() * 20)} m
                    </div>
                  </div>
                </div>
                
                {/* Estado de Misión */}
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-600">
                  <div className="flex items-center justify-between mb-2">
                    <Target className="w-4 h-4 text-orange-400" />
                    <span className="text-xs text-slate-400">MISIÓN ACTIVA</span>
                  </div>
                  <div className="text-sm font-semibold text-orange-400 capitalize">
                    {missionType} en Progreso
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Tiempo transcurrido: {Math.floor(Math.random() * 5 + 1)}:32 min
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mapeo LIDAR */}
      {getDeployedCount() > 0 && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Radar className="w-8 h-8 text-cyan-400" />
                <h4 className="text-xl font-semibold text-cyan-400">
                  Mapeo LIDAR en Tiempo Real
                </h4>
              </div>
              <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                ALTA PRECISIÓN
              </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Pantalla LIDAR con puntos azules */}
              <div className="space-y-4">
                <h5 className="text-cyan-300 font-semibold">Visualización LIDAR</h5>
                
                <div className="relative bg-slate-900/80 rounded-lg h-64 overflow-hidden border border-cyan-500/30">
                  {/* Grid de fondo */}
                  <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                      <div key={i} className="absolute border-cyan-700/20" style={{
                        left: `${i * 5}%`,
                        top: 0,
                        bottom: 0,
                        width: '1px',
                        borderLeft: '1px solid'
                      }}></div>
                    ))}
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="absolute border-cyan-700/20" style={{
                        top: `${i * 6.25}%`,
                        left: 0,
                        right: 0,
                        height: '1px',
                        borderTop: '1px solid'
                      }}></div>
                    ))}
                  </div>
                  
                  {/* Puntos LIDAR azules */}
                  {[...Array(150)].map((_, i) => (
                    <div 
                      key={i}
                      className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
                      style={{
                        left: `${Math.random() * 95}%`,
                        top: `${Math.random() * 95}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        opacity: 0.3 + Math.random() * 0.7
                      }}
                    ></div>
                  ))}
                  
                  {/* Líneas de barrido */}
                  <div className="absolute inset-0">
                    <div className="absolute w-full h-0.5 bg-linear-to-r from-transparent via-cyan-400 to-transparent animate-pulse" 
                         style={{ top: `${(Date.now() / 50) % 100}%` }}></div>
                  </div>
                  
                  {/* Centro del radar */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  
                  {/* HUD Info */}
                  <div className="absolute top-2 left-2 text-xs text-cyan-400 font-mono">
                    LIDAR | 360° | {Math.round(Math.random() * 50 + 100)} pts/sec
                  </div>
                  <div className="absolute bottom-2 right-2 text-xs text-cyan-400 font-mono">
                    Alcance: 200m | Resolución: 1cm
                  </div>
                </div>
              </div>

              {/* Datos del Mapeo */}
              <div className="space-y-4">
                <h5 className="text-cyan-300 font-semibold">Datos de Escaneo</h5>
                
                <div className="space-y-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Puntos escaneados:</span>
                      <span className="text-cyan-400 font-bold">1,247,382</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Área mapeada:</span>
                      <span className="text-green-400 font-bold">
                        {Math.round(getDeployedCount() * 3.7)} km²
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Obstáculos detectados:</span>
                      <span className="text-red-400 font-bold">{droneMap.obstacles.length}</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Precisión:</span>
                      <span className="text-purple-400 font-bold">±1.2cm</span>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Última actualización:</span>
                      <span className="text-yellow-400 font-bold">
                        {new Date().toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-slate-500 p-3 bg-slate-800/30 rounded">
                  🛰️ El sistema LIDAR escanea continuamente el terreno para crear un mapa 3D de alta precisión
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detection Alerts */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-400 mb-6">
            Alertas de Detección
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Detections */}
            <div className="space-y-3">
              <h5 className="text-orange-300 font-semibold">Detecciones Recientes</h5>
              
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {detectedObjects.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <Radar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <div className="text-sm">No hay detecciones activas</div>
                  </div>
                ) : (
                  detectedObjects.map((obj) => (
                    <div key={obj.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getObjectIcon(obj.type)}
                        <div>
                          <div className="text-sm font-semibold capitalize">{obj.type}</div>
                          <div className="text-xs text-slate-400">
                            {obj.distance}m - {obj.bearing}° - {obj.drone}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-green-400">{obj.confidence}%</div>
                        <div className="text-xs text-slate-500">confianza</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Detection Statistics */}
            <div className="space-y-4">
              <h5 className="text-orange-300 font-semibold">Estadísticas</h5>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-blue-400">
                    {detectedObjects.filter(obj => obj.type === 'person').length}
                  </div>
                  <div className="text-xs text-slate-400">Personas</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-green-400">
                    {detectedObjects.filter(obj => obj.type === 'car').length}
                  </div>
                  <div className="text-xs text-slate-400">Autos</div>
                </div>
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-lg font-bold text-yellow-400">
                    {detectedObjects.filter(obj => obj.type === 'motorcycle').length}
                  </div>
                  <div className="text-xs text-slate-400">Motos</div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-lg font-bold text-purple-400">
                  {detectedObjects.length}
                </div>
                <div className="text-xs text-slate-400">Total Detecciones</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Drone Map */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6">
            Mapa de Reconocimiento LIDAR
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Mini Map */}
            <div className="space-y-4">
              <h5 className="text-blue-300 font-semibold">Mini Mapa del Dron</h5>
              
              <div className="relative bg-slate-800/50 rounded-lg h-48 overflow-hidden">
                {/* Map grid */}
                <div className="absolute inset-0 opacity-20">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="border-b border-slate-600" style={{ height: '10%' }}></div>
                  ))}
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="absolute border-r border-slate-600 h-full" style={{ left: `${i * 10}%`, width: '1px' }}></div>
                  ))}
                </div>
                
                {/* Vehicle position (center) */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Car className="w-6 h-6 text-cyan-400" />
                </div>
                
                {/* Drone positions */}
                {Object.entries(dronesStatus).map(([key, drone]) => {
                  if (drone.deployed) {
                    return (
                      <div 
                        key={key}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          left: `${50 + drone.position.x * 0.2}%`,
                          top: `${50 + drone.position.y * 0.2}%`
                        }}
                      >
                        <Plane className="w-4 h-4 text-green-400" />
                      </div>
                    );
                  }
                  return null;
                })}
                
                {/* Obstacles */}
                {droneMap.obstacles.map((obstacle, index) => (
                  <div 
                    key={index}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${obstacle.position.x}%`,
                      top: `${obstacle.position.y}%`
                    }}
                  >
                    <AlertTriangle className={`w-3 h-3 ${
                      obstacle.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                    }`} />
                  </div>
                ))}
              </div>
              
              <div className="text-xs text-slate-500 text-center">
                {droneMap.lastUpdate ? 
                  `Actualizado: ${droneMap.lastUpdate.toLocaleTimeString()}` : 
                  'Esperando datos del dron'
                }
              </div>
            </div>

            {/* Map Data */}
            <div className="space-y-4">
              <h5 className="text-blue-300 font-semibold">Datos del Mapa</h5>
              
              <div className="space-y-3">
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Obstáculos detectados:</span>
                    <span className="text-red-400 font-bold">{droneMap.obstacles.length}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Área mapeada:</span>
                    <span className="text-green-400 font-bold">
                      {Math.round(getDeployedCount() * 2.5)} km²
                    </span>
                  </div>
                </div>
                
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Precisión LIDAR:</span>
                    <span className="text-cyan-400 font-bold">±2cm</span>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-slate-500">
                🛰️ Los drones mapean baches, desniveles y obstáculos para optimizar la ruta del vehículo
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Energy Transfer */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-yellow-400 mb-6">
            Transferencia de Energía Dron → Vehículo
          </h4>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {energyTransfer[0]}%
              </div>
              <div className="text-sm text-slate-400">
                Transferencia de energía activa
              </div>
            </div>
            
            <Slider
              value={energyTransfer}
              onValueChange={handleEnergyTransfer}
              max={100}
              step={5}
              className="w-full"
              disabled={disabled || getDeployedCount() === 0}
            />
            
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Plane className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 font-semibold">Drones</span>
                </div>
                <div className="text-sm text-slate-300">
                  Batería promedio: {Math.round((dronesStatus.drone1.battery + dronesStatus.drone2.battery) / 2)}%
                </div>
              </div>
              
              <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-semibold">Vehículo</span>
                </div>
                <div className="text-sm text-slate-300">
                  Recibiendo: +{(energyTransfer[0] * 0.5).toFixed(1)} kWh
                </div>
              </div>
            </div>
            
            <div className="text-xs text-slate-500 text-center">
              ⚡ Los drones pueden transferir energía de emergencia al vehículo principal
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReconnaissanceSystem;