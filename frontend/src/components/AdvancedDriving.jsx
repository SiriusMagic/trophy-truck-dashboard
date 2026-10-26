import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Zap,
  Sun,
  Battery,
  Car,
  Brain,
  Eye,
  Hand,
  Gauge,
  RotateCcw,
  Target,
  Settings,
  Activity,
  ArrowLeftRight
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdvancedDriving = ({ vehicleData, disabled }) => {
  const [steerByWire, setSteerByWire] = useState({
    ratio: 270, // degrees (180-360)
    mode: 'variable', // variable, fixed
    sensitivity: 75
  });
  
  const [torqueVectoring, setTorqueVectoring] = useState({
    aggressiveness: 60,
    mode: 'balanced', // track, balanced, comfort
    active: true
  });
  
  const [solarPanels, setSolarPanels] = useState({
    frontHood: { active: true, output: 0.8 }, // kW
    roof: { active: true, output: 1.2 },
    rearDeck: { active: true, output: 0.6 },
    doors: { active: true, output: 0.4 },
    totalOutput: 3.0,
    inverterVoltage: 48.2,
    inverterAmperage: 62.4
  });
  
  const [wheelMotors, setWheelMotors] = useState({
    frontLeft: { voltage: 380, amperage: 120, rpm: 0, temp: 28 },
    frontRight: { voltage: 380, amperage: 120, rpm: 0, temp: 28 },
    rearLeft: { voltage: 400, amperage: 150, rpm: 0, temp: 32 },
    rearRight: { voltage: 400, amperage: 150, rpm: 0, temp: 32 },
    differential: {
      front: 'open', // open, locked, disconnected
      rear: 'open'
    }
  });
  
  const [drivingMode, setDrivingMode] = useState({
    current: 'manual', // manual, assisted, semi-autonomous, full-autonomous
    availableModes: ['manual', 'assisted', 'semi-autonomous']
  });

  const { toast } = useToast();

  // Simulate solar panel output based on time and weather
  useEffect(() => {
    const interval = setInterval(() => {
      const baseOutput = Math.random() * 0.3 + 0.7; // Base solar efficiency
      const weatherFactor = vehicleData.batteryTemp > 25 ? 1.2 : 0.8; // Sunny vs cloudy
      
      setSolarPanels(prev => {
        const newPanels = {
          ...prev,
          frontHood: { ...prev.frontHood, output: (0.8 * baseOutput * weatherFactor).toFixed(2) },
          roof: { ...prev.roof, output: (1.2 * baseOutput * weatherFactor).toFixed(2) },
          rearDeck: { ...prev.rearDeck, output: (0.6 * baseOutput * weatherFactor).toFixed(2) },
          doors: { ...prev.doors, output: (0.4 * baseOutput * weatherFactor).toFixed(2) }
        };
        
        const totalOutput = Object.values(newPanels)
          .filter(panel => panel.active && panel.output)
          .reduce((sum, panel) => sum + parseFloat(panel.output), 0);
        
        return {
          ...newPanels,
          totalOutput: totalOutput.toFixed(2),
          inverterVoltage: 48 + Math.random() * 4,
          inverterAmperage: totalOutput * 13 + Math.random() * 10
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [vehicleData.batteryTemp]);

  // Simulate wheel motor RPM based on speed
  useEffect(() => {
    const baseRPM = vehicleData.speed * 15; // Rough conversion
    setWheelMotors(prev => ({
      ...prev,
      frontLeft: { ...prev.frontLeft, rpm: baseRPM + Math.random() * 50 },
      frontRight: { ...prev.frontRight, rpm: baseRPM + Math.random() * 50 },
      rearLeft: { ...prev.rearLeft, rpm: baseRPM + Math.random() * 50 },
      rearRight: { ...prev.rearRight, rpm: baseRPM + Math.random() * 50 }
    }));
  }, [vehicleData.speed]);

  const handleSteerRatioChange = (value) => {
    setSteerByWire(prev => ({ ...prev, ratio: value[0] }));
  };

  const handleDifferentialChange = (axle, mode) => {
    setWheelMotors(prev => ({
      ...prev,
      differential: { ...prev.differential, [axle]: mode }
    }));
    
    toast({
      title: `Diferencial ${axle}`,
      description: `Modo ${mode} activado`,
    });
  };

  const handleDrivingModeChange = (mode) => {
    setDrivingMode(prev => ({ ...prev, current: mode }));
    
    const descriptions = {
      manual: 'Control manual completo',
      assisted: 'Asistencia de conducción activa',
      'semi-autonomous': 'Piloto automático parcial',
      'full-autonomous': 'Conducción autónoma completa'
    };
    
    toast({
      title: `Modo de conducción: ${mode}`,
      description: descriptions[mode],
    });
  };

  const getSteerRatioDescription = () => {
    if (steerByWire.ratio <= 200) return 'Ultra sensible (Maniobras)';
    if (steerByWire.ratio <= 270) return 'Deportivo (Equilibrado)';
    if (steerByWire.ratio <= 320) return 'Confort (Carretera)';
    return 'Estable (Alta velocidad)';
  };

  const getDifferentialIcon = (mode) => {
    switch(mode) {
      case 'open': return '⚪';
      case 'locked': return '🔒';
      case 'disconnected': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Steer-by-Wire System */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-6">
            Sistema de Dirección Electrónica (Steer-by-Wire)
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Steering Ratio */}
            <div className="space-y-4">
              <h5 className="text-purple-300 font-semibold">Relación de Dirección Variable</h5>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {steerByWire.ratio}°
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  {getSteerRatioDescription()}
                </div>
              </div>
              
              <Slider
                value={[steerByWire.ratio]}
                onValueChange={handleSteerRatioChange}
                min={180}
                max={360}
                step={10}
                className="w-full"
                disabled={disabled}
              />
              
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center p-2 bg-slate-800/50 rounded">
                  <div className="text-purple-400 font-bold">180°</div>
                  <div className="text-slate-500">Off-Road</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded">
                  <div className="text-purple-400 font-bold">270°</div>
                  <div className="text-slate-500">Deportivo</div>
                </div>
                <div className="text-center p-2 bg-slate-800/50 rounded">
                  <div className="text-purple-400 font-bold">360°</div>
                  <div className="text-slate-500">Carretera</div>
                </div>
              </div>
            </div>

            {/* Torque Vectoring */}
            <div className="space-y-4">
              <h5 className="text-purple-300 font-semibold">Vectorización de Torque</h5>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Agresividad</span>
                  <span className="text-purple-400 font-bold">{torqueVectoring.aggressiveness}%</span>
                </div>
                
                <Slider
                  value={[torqueVectoring.aggressiveness]}
                  onValueChange={(value) => setTorqueVectoring(prev => ({ ...prev, aggressiveness: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                
                <div className="space-y-2">
                  {['comfort', 'balanced', 'track'].map((mode) => (
                    <Button
                      key={mode}
                      variant={torqueVectoring.mode === mode ? "default" : "outline"}
                      onClick={() => setTorqueVectoring(prev => ({ ...prev, mode }))}
                      disabled={disabled}
                      className={`w-full justify-start text-sm ${
                        torqueVectoring.mode === mode ? 'bg-purple-600' : ''
                      }`}
                    >
                      {mode === 'comfort' ? '🚗 Confort' :
                       mode === 'balanced' ? '⚖️ Equilibrado' : '🏁 Pista'}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4-Motor System */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-6">
            Sistema de 4 Motores Independientes por Semieje
          </h4>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(wheelMotors).filter(([key]) => key !== 'differential').map(([wheel, motor]) => (
              <Card key={wheel} className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h5 className={`font-semibold mb-3 text-sm ${
                    wheel.includes('front') ? 'text-blue-400' : 'text-red-400'
                  }`}>
                    Motor {wheel === 'frontLeft' ? 'Delantero Izq' :
                           wheel === 'frontRight' ? 'Delantero Der' :
                           wheel === 'rearLeft' ? 'Trasero Izq' : 'Trasero Der'}
                  </h5>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Voltaje:</span>
                      <span className={wheel.includes('front') ? 'text-blue-400' : 'text-red-400'}>
                        {motor.voltage}V
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Amperaje:</span>
                      <span className={wheel.includes('front') ? 'text-blue-400' : 'text-red-400'}>
                        {motor.amperage}A
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">RPM:</span>
                      <span className={wheel.includes('front') ? 'text-blue-400' : 'text-red-400'}>
                        {Math.round(motor.rpm)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Temp:</span>
                      <span className={motor.temp > 35 ? 'text-orange-400' : 'text-green-400'}>
                        {motor.temp}°C
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Differential Controls */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Front Differential */}
            <div className="space-y-3">
              <h5 className="text-blue-300 font-semibold">Diferencial Delantero</h5>
              <div className="flex space-x-2">
                {['open', 'locked', 'disconnected'].map((mode) => (
                  <Button
                    key={mode}
                    variant={wheelMotors.differential.front === mode ? "default" : "outline"}
                    onClick={() => handleDifferentialChange('front', mode)}
                    disabled={disabled}
                    className={`flex-1 text-xs ${
                      wheelMotors.differential.front === mode ? 'bg-blue-600' : ''
                    }`}
                  >
                    {getDifferentialIcon(mode)} {mode}
                  </Button>
                ))}
              </div>
            </div>

            {/* Rear Differential */}
            <div className="space-y-3">
              <h5 className="text-red-300 font-semibold">Diferencial Trasero</h5>
              <div className="flex space-x-2">
                {['open', 'locked', 'disconnected'].map((mode) => (
                  <Button
                    key={mode}
                    variant={wheelMotors.differential.rear === mode ? "default" : "outline"}
                    onClick={() => handleDifferentialChange('rear', mode)}
                    disabled={disabled}
                    className={`flex-1 text-xs ${
                      wheelMotors.differential.rear === mode ? 'bg-red-600' : ''
                    }`}
                  >
                    {getDifferentialIcon(mode)} {mode}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Solar Panels System */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-yellow-400 mb-6">
            Paneles Solares Integrados - Captura Continua de Energía
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Solar Panel Status */}
            <div className="space-y-4">
              <h5 className="text-yellow-300 font-semibold">Estado de Paneles</h5>
              
              <div className="space-y-3">
                {Object.entries(solarPanels).filter(([key]) => 
                  ['frontHood', 'roof', 'rearDeck', 'doors'].includes(key)
                ).map(([panel, data]) => (
                  <div key={panel} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Sun className={`w-4 h-4 ${data.active ? 'text-yellow-400' : 'text-slate-500'}`} />
                      <span className="text-sm font-medium">
                        {panel === 'frontHood' ? 'Capó Delantero' :
                         panel === 'roof' ? 'Techo Principal' :
                         panel === 'rearDeck' ? 'Cubierta Trasera' : 'Puertas Laterales'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-400 font-bold">{data.output} kW</span>
                      <Switch
                        checked={data.active}
                        onCheckedChange={(checked) => 
                          setSolarPanels(prev => ({ 
                            ...prev, 
                            [panel]: { ...prev[panel], active: checked }
                          }))
                        }
                        disabled={disabled}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Power Output */}
            <div className="space-y-4">
              <h5 className="text-yellow-300 font-semibold">Salida del Inversor</h5>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {solarPanels.totalOutput} kW
                </div>
                <div className="text-sm text-slate-400 mb-4">
                  Generación Solar Total
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Voltaje del Inversor:</span>
                  <span className="text-yellow-400 font-bold">{solarPanels.inverterVoltage.toFixed(1)}V</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Amperaje del Inversor:</span>
                  <span className="text-yellow-400 font-bold">{solarPanels.inverterAmperage.toFixed(1)}A</span>
                </div>
                
                <Progress value={parseFloat(solarPanels.totalOutput) * 20} className="h-3" />
                
                <div className="text-xs text-slate-500 text-center">
                  ☀️ Capturando energía solar las 24/7 - Hasta la mínima luz disponible
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modular Driving System */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-sm">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6">
            Sistema de Conducción Modular
          </h4>
          
          <div className="space-y-6">
            
            {/* Current Mode */}
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {drivingMode.current.toUpperCase().replace('-', ' ')}
              </div>
              <div className="text-sm text-slate-400">
                Modo de Conducción Activo
              </div>
            </div>
            
            {/* Mode Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'manual', label: 'Manual', icon: Hand, desc: 'Control total del conductor' },
                { id: 'assisted', label: 'Asistida', icon: Eye, desc: 'Asistencia de conducción' },
                { id: 'semi-autonomous', label: 'Semi-Autónoma', icon: Brain, desc: 'Piloto automático parcial' },
                { id: 'full-autonomous', label: 'Autónoma Total', icon: Car, desc: 'Conducción completamente autónoma' }
              ].map((mode) => (
                <Button
                  key={mode.id}
                  variant={drivingMode.current === mode.id ? "default" : "outline"}
                  onClick={() => handleDrivingModeChange(mode.id)}
                  disabled={disabled || !drivingMode.availableModes.includes(mode.id)}
                  className={`h-20 flex flex-col ${
                    drivingMode.current === mode.id ? 'bg-green-600' : ''
                  } ${
                    !drivingMode.availableModes.includes(mode.id) ? 'opacity-50' : ''
                  }`}
                >
                  <mode.icon className="w-6 h-6 mb-2" />
                  <span className="text-xs font-bold">{mode.label}</span>
                  <span className="text-xs text-slate-400">{mode.desc}</span>
                </Button>
              ))}
            </div>
            
            {/* Mode Description */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="text-sm text-slate-300">
                {drivingMode.current === 'manual' && 
                  '👤 El conductor tiene control completo del vehículo. Todos los sistemas están disponibles manualmente.'}
                {drivingMode.current === 'assisted' && 
                  '🤝 Asistencia activa: Control de crucero adaptativo, mantenimiento de carril, frenado automático.'}
                {drivingMode.current === 'semi-autonomous' && 
                  '🧠 Piloto automático: El vehículo conduce pero requiere supervisión constante del conductor.'}
                {drivingMode.current === 'full-autonomous' && 
                  '🤖 Conducción completamente autónoma: El vehículo maneja todas las situaciones de tráfico.'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedDriving;