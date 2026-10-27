import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Car,
  DoorOpen,
  DoorClosed,
  Camera,
  Volume2,
  Settings,
  User,
  Eye,
  Wind,
  Monitor,
  Mic,
  Lock,
  ChevronUp,
  UserCheck,
  Sparkles,
  Sun,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SmartVehicleControl = ({ vehicleData, disabled }) => {
  const [spoilerHeight, setSpoilerHeight] = useState(50);
  const [doorsStatus, setDoorsStatus] = useState({
    frontLeft: false,
    frontRight: false,
    rearLeft: false,
    rearRight: false,
    trunk: false
  });
  const [lockMode, setLockMode] = useState('automatic'); // automatic, manual, brake
  const [userProfile, setUserProfile] = useState('Profile 1');
  const [voiceActive, setVoiceActive] = useState(false);
  const [welcomeRitual, setWelcomeRitual] = useState(false);
  const [glassOpacity, setGlassOpacity] = useState([20]); // 0-100%
  const [proximityDetection, setProximityDetection] = useState(false);
  const [screenMode, setScreenMode] = useState('dashboard');
  const [cameraViews, setCameraViews] = useState({
    rear: true,
    front: false,
    sides: false,
    overhead: false
  });
  const { toast } = useToast();

  // Auto spoiler based on speed
  useEffect(() => {
    if (vehicleData.speed > 80) {
      setSpoilerHeight(90);
    } else if (vehicleData.speed > 50) {
      setSpoilerHeight(70);
    } else {
      setSpoilerHeight(30);
    }
  }, [vehicleData.speed]);

  // Proximity detection simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const detected = Math.random() > 0.8; // Simulate proximity detection
      if (detected !== proximityDetection) {
        setProximityDetection(detected);
        if (detected && welcomeRitual) {
          triggerWelcomeRitual();
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [proximityDetection, welcomeRitual]);

  const handleDoorToggle = (door) => {
    setDoorsStatus(prev => ({
      ...prev,
      [door]: !prev[door]
    }));

    toast({
      title: `${doorsStatus[door] ? 'Cerrando' : 'Abriendo'} puerta`,
      description: `${door} ${doorsStatus[door] ? 'cerrada' : 'abierta'}`,
    });
  };

  const handleLockModeChange = (mode) => {
    setLockMode(mode);
    toast({
      title: `Modo de cierre: ${mode}`,
      description: mode === 'automatic' ? 'Cierre al alejarse' : 
                   mode === 'brake' ? 'Cierre al pisar freno' : 'Control manual',
    });
  };

  const triggerWelcomeRitual = () => {
    toast({
      title: "🎭 RITUAL DE BIENVENIDA INICIADO",
      description: "Bajando suspensión y preparando acceso...",
    });

    // Simulate welcome sequence
    setTimeout(() => {
      setDoorsStatus(prev => ({ ...prev, frontLeft: true }));
      toast({
        title: "✨ Bienvenido de vuelta",
        description: "Vehículo listo. Perfil cargado automáticamente.",
      });
    }, 2000);
  };

  const handleVoiceCommand = (command) => {
    switch(command) {
      case 'open_windows':
        toast({ title: "🎤 Comando de voz", description: "Abriendo ventanas..." });
        break;
      case 'open_trunk':
        setDoorsStatus(prev => ({ ...prev, trunk: true }));
        toast({ title: "🎤 Comando de voz", description: "Abriendo maletero..." });
        break;
      case 'close_all':
        setDoorsStatus({ frontLeft: false, frontRight: false, rearLeft: false, rearRight: false, trunk: false });
        toast({ title: "🎤 Comando de voz", description: "Cerrando todo..." });
        break;
    }
  };

  const userProfiles = [
    { name: 'Profile 1', seatPosition: 65, mirrorAngle: 45, headrestHeight: 70 },
    { name: 'Profile 2', seatPosition: 80, mirrorAngle: 52, headrestHeight: 85 },
    { name: 'Profile 3', seatPosition: 55, mirrorAngle: 38, headrestHeight: 60 }
  ];

  const getCurrentProfile = () => userProfiles.find(p => p.name === userProfile) || userProfiles[0];

  return (
    <div className="space-y-6">
      
      {/* System Status Overview */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-400">
              Sistema de Control Inteligente del Vehículo
            </h3>
            <div className="flex items-center space-x-4">
              <Badge variant={proximityDetection ? "default" : "outline-solid"}>
                {proximityDetection ? "👤 USUARIO DETECTADO" : "📡 ESCANEANDO"}
              </Badge>
              <Badge variant={voiceActive ? "destructive" : "outline-solid"}>
                {voiceActive ? "🎤 ESCUCHANDO" : "🔇 VOZ OFF"}
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-2">
                {spoilerHeight}%
              </div>
              <div className="text-sm text-slate-400">Alerón Activo</div>
              <Progress value={spoilerHeight} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">
                {userProfile}
              </div>
              <div className="text-sm text-slate-400">Perfil Activo</div>
              <div className="h-2 mt-2 bg-green-400/20 rounded"></div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">
                {glassOpacity[0]}%
              </div>
              <div className="text-sm text-slate-400">Opacidad Vidrio</div>
              <Progress value={glassOpacity[0]} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-2">
                {Object.values(doorsStatus).filter(Boolean).length}/5
              </div>
              <div className="text-sm text-slate-400">Puertas Abiertas</div>
              <Progress value={Object.values(doorsStatus).filter(Boolean).length * 20} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Control Tabs */}
      <Tabs defaultValue="doors" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="doors" className="data-[state=active]:bg-purple-600">
            <DoorOpen className="w-4 h-4 mr-2" />
            Puertas
          </TabsTrigger>
          <TabsTrigger value="aerodynamics" className="data-[state=active]:bg-cyan-600">
            <ChevronUp className="w-4 h-4 mr-2" />
            Aerodinámico
          </TabsTrigger>
          <TabsTrigger value="displays" className="data-[state=active]:bg-green-600">
            <Monitor className="w-4 h-4 mr-2" />
            Pantallas
          </TabsTrigger>
          <TabsTrigger value="profiles" className="data-[state=active]:bg-blue-600">
            <User className="w-4 h-4 mr-2" />
            Perfiles
          </TabsTrigger>
          <TabsTrigger value="voice" className="data-[state=active]:bg-orange-600">
            <Mic className="w-4 h-4 mr-2" />
            Voz & IA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doors" className="space-y-6">
          {/* Door Control System */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-purple-400 mb-6">
                Sistema de Puertas y Acceso Inteligente
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Door Controls */}
                <div className="space-y-4">
                  <h5 className="text-purple-300 font-semibold">Control de Puertas</h5>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(doorsStatus).map(([door, isOpen]) => (
                      <Button
                        key={door}
                        variant={isOpen ? "destructive" : "outline-solid"}
                        onClick={() => handleDoorToggle(door)}
                        disabled={disabled}
                        className="h-16 flex flex-col"
                      >
                        {isOpen ? <DoorOpen className="w-6 h-6 mb-1" /> : <DoorClosed className="w-6 h-6 mb-1" />}
                        <span className="text-xs">
                          {door === 'frontLeft' ? 'Delantera Izq' :
                           door === 'frontRight' ? 'Delantera Der' :
                           door === 'rearLeft' ? 'Trasera Izq' :
                           door === 'rearRight' ? 'Trasera Der' : 'Maletero'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {isOpen ? 'ABIERTA' : 'CERRADA'}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Lock Modes */}
                <div className="space-y-4">
                  <h5 className="text-purple-300 font-semibold">Modos de Cierre</h5>
                  
                  <div className="space-y-3">
                    {[
                      { id: 'automatic', label: 'Automático', desc: 'Cierre al alejarse', icon: Lock },
                      { id: 'brake', label: 'Al Frenar', desc: 'Cierre al pisar freno', icon: Car },
                      { id: 'manual', label: 'Manual', desc: 'Control manual', icon: Settings }
                    ].map((mode) => (
                      <Button
                        key={mode.id}
                        variant={lockMode === mode.id ? "default" : "outline-solid"}
                        onClick={() => handleLockModeChange(mode.id)}
                        disabled={disabled}
                        className={`w-full justify-start h-12 ${
                          lockMode === mode.id ? 'bg-purple-600' : ''
                        }`}
                      >
                        <mode.icon className="w-5 h-5 mr-3" />
                        <div className="text-left">
                          <div className="font-semibold">{mode.label}</div>
                          <div className="text-xs text-slate-400">{mode.desc}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Welcome Ritual */}
              <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-purple-300 font-semibold flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Ritual de Bienvenida
                  </h5>
                  <Switch 
                    checked={welcomeRitual} 
                    onCheckedChange={setWelcomeRitual}
                    disabled={disabled}
                  />
                </div>
                
                {welcomeRitual && (
                  <div className="text-sm text-slate-400 mb-4">
                    Secuencia automática: Bajar suspensión → Abrir puerta → Cargar perfil → Encender luces de bienvenida
                  </div>
                )}
                
                <Button
                  onClick={triggerWelcomeRitual}
                  disabled={disabled || !welcomeRitual}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Activar Ritual Manualmente
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aerodynamics" className="space-y-6">
          {/* Aerodynamics Control */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-cyan-400 mb-6">
                Sistema Aerodinámico Inteligente
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Spoiler Control */}
                <div className="space-y-4">
                  <h5 className="text-cyan-300 font-semibold">Control de Alerón</h5>
                  
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-cyan-400 mb-2">
                      {spoilerHeight}%
                    </div>
                    <div className="text-sm text-slate-400">
                      Auto-ajuste basado en velocidad: {Math.round(vehicleData.speed)} km/h
                    </div>
                  </div>
                  
                  <Slider
                    value={[spoilerHeight]}
                    onValueChange={(value) => setSpoilerHeight(value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                    disabled={disabled}
                  />
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <div className="text-cyan-400 font-bold">0-50 km/h</div>
                      <div className="text-slate-500">30% altura</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <div className="text-cyan-400 font-bold">50-80 km/h</div>
                      <div className="text-slate-500">70% altura</div>
                    </div>
                    <div className="text-center p-2 bg-slate-800/50 rounded">
                      <div className="text-cyan-400 font-bold">80+ km/h</div>
                      <div className="text-slate-500">90% altura</div>
                    </div>
                  </div>
                </div>

                {/* Glass Opacity Control */}
                <div className="space-y-4">
                  <h5 className="text-cyan-300 font-semibold">Control de Opacidad de Vidrios</h5>
                  
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-blue-400 mb-2">
                      {glassOpacity[0]}%
                    </div>
                    <div className="text-sm text-slate-400">
                      {glassOpacity[0] < 30 ? 'Transparente' :
                       glassOpacity[0] < 70 ? 'Semi-opaco' : 'Privacidad máxima'}
                    </div>
                  </div>
                  
                  <Slider
                    value={glassOpacity}
                    onValueChange={setGlassOpacity}
                    max={100}
                    step={5}
                    className="w-full"
                    disabled={disabled}
                  />
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setGlassOpacity([10])}
                      disabled={disabled}
                      className="text-xs"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Transparente
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setGlassOpacity([90])}
                      disabled={disabled}
                      className="text-xs"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Privacidad
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="displays" className="space-y-6">
          {/* Display Management */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-green-400 mb-6">
                Gestión de Pantallas y Cámaras
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Screen Modes */}
                <div className="space-y-4">
                  <h5 className="text-green-300 font-semibold">Modos de Pantalla</h5>
                  
                  <div className="space-y-2">
                    {[
                      { id: 'dashboard', label: 'Dashboard Principal', icon: Monitor },
                      { id: 'cameras', label: 'Vista de Cámaras', icon: Camera },
                      { id: 'navigation', label: 'Navegación', icon: Car },
                      { id: 'entertainment', label: 'Entretenimiento', icon: Volume2 }
                    ].map((mode) => (
                      <Button
                        key={mode.id}
                        variant={screenMode === mode.id ? "default" : "outline-solid"}
                        onClick={() => setScreenMode(mode.id)}
                        disabled={disabled}
                        className={`w-full justify-start ${
                          screenMode === mode.id ? 'bg-green-600' : ''
                        }`}
                      >
                        <mode.icon className="w-4 h-4 mr-3" />
                        {mode.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Camera Views */}
                <div className="space-y-4">
                  <h5 className="text-green-300 font-semibold">Vistas de Cámaras</h5>
                  
                  <div className="space-y-3">
                    {Object.entries(cameraViews).map(([camera, active]) => (
                      <div key={camera} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Camera className="w-5 h-5 text-green-400" />
                          <span className="text-sm font-medium">
                            {camera === 'rear' ? 'Cámara Trasera' :
                             camera === 'front' ? 'Cámara Frontal' :
                             camera === 'sides' ? 'Cámaras Laterales' : 'Vista Superior'}
                          </span>
                        </div>
                        <Switch
                          checked={active}
                          onCheckedChange={(checked) => 
                            setCameraViews(prev => ({ ...prev, [camera]: checked }))
                          }
                          disabled={disabled}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profiles" className="space-y-6">
          {/* User Profiles */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-blue-400 mb-6">
                Perfiles de Usuario y Ajustes Automáticos
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Profile Selection */}
                <div className="space-y-4">
                  <h5 className="text-blue-300 font-semibold">Perfiles Disponibles</h5>
                  
                  <div className="space-y-2">
                    {userProfiles.map((profile) => (
                      <Button
                        key={profile.name}
                        variant={userProfile === profile.name ? "default" : "outline-solid"}
                        onClick={() => setUserProfile(profile.name)}
                        disabled={disabled}
                        className={`w-full justify-start ${
                          userProfile === profile.name ? 'bg-blue-600' : ''
                        }`}
                      >
                        <UserCheck className="w-4 h-4 mr-3" />
                        {profile.name}
                        {userProfile === profile.name && (
                          <Badge className="ml-auto bg-blue-700">ACTIVO</Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Profile Settings */}
                <div className="space-y-4">
                  <h5 className="text-blue-300 font-semibold">Configuración Actual</h5>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Posición del Asiento</span>
                        <span className="text-blue-400 font-bold">{getCurrentProfile().seatPosition}%</span>
                      </div>
                      <Progress value={getCurrentProfile().seatPosition} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Ángulo de Espejos</span>
                        <span className="text-blue-400 font-bold">{getCurrentProfile().mirrorAngle}°</span>
                      </div>
                      <Progress value={getCurrentProfile().mirrorAngle} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Altura Reposacabezas</span>
                        <span className="text-blue-400 font-bold">{getCurrentProfile().headrestHeight}%</span>
                      </div>
                      <Progress value={getCurrentProfile().headrestHeight} className="h-2" />
                    </div>
                  </div>
                  
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={disabled}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Aplicar Configuración
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          {/* Voice Control */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold text-orange-400 mb-6">
                Control por Voz e Inteligencia Artificial
              </h4>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Voice Activation */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-orange-300 font-semibold">Sistema de Voz</h5>
                    <Switch
                      checked={voiceActive}
                      onCheckedChange={setVoiceActive}
                      disabled={disabled}
                    />
                  </div>
                  
                  <div className={`p-4 rounded-lg ${voiceActive ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-slate-800/50'}`}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Mic className={`w-6 h-6 ${voiceActive ? 'text-orange-400' : 'text-slate-500'}`} />
                      <span className={`font-semibold ${voiceActive ? 'text-orange-400' : 'text-slate-500'}`}>
                        {voiceActive ? 'Escuchando comandos...' : 'Sistema de voz desactivado'}
                      </span>
                    </div>
                    
                    {voiceActive && (
                      <div className="text-xs text-slate-400">
                        Di "Hola Trophy" para activar comandos de voz
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-orange-300 mb-3">Comandos Rápidos:</div>
                    {[
                      { cmd: 'open_windows', label: 'Abrir Ventanas', icon: Wind },
                      { cmd: 'open_trunk', label: 'Abrir Maletero', icon: DoorOpen },
                      { cmd: 'close_all', label: 'Cerrar Todo', icon: Lock }
                    ].map((command) => (
                      <Button
                        key={command.cmd}
                        variant="outline"
                        onClick={() => handleVoiceCommand(command.cmd)}
                        disabled={disabled || !voiceActive}
                        className="w-full justify-start"
                      >
                        <command.icon className="w-4 h-4 mr-3" />
                        {command.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* AI Assistant */}
                <div className="space-y-4">
                  <h5 className="text-orange-300 font-semibold">Asistente IA del Vehículo</h5>
                  
                  <div className="bg-slate-800/50 p-4 rounded-lg">
                    <div className="text-sm text-slate-300 mb-3">
                      💬 "¿En qué puedo ayudarte hoy?"
                    </div>
                    
                    <div className="space-y-2 text-xs text-slate-400">
                      <div>• "Prepara el vehículo para carretera"</div>
                      <div>• "Activa modo deportivo completo"</div>
                      <div>• "Abre el maletero y baja la suspensión"</div>
                      <div>• "Configura para lluvia"</div>
                      <div>• "Ritual de despedida"</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      disabled={disabled}
                      className="text-xs"
                    >
                      🎯 Modo Inteligente
                    </Button>
                    <Button
                      variant="outline"
                      disabled={disabled}
                      className="text-xs"
                    >
                      🤖 Configurar IA
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SmartVehicleControl;