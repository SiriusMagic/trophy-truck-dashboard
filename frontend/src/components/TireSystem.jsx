import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import {
  Brain,
  Settings,
  Target,
  ArrowLeftRight,
  CircleDot,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TireSystem = ({ vehicleData, disabled }) => {
  const [tireControlMode, setTireControlMode] = useState('individual'); // 'individual', 'front', 'rear', 'ai'
  const [aiTireActive, setAiTireActive] = useState(false);
  
  // Individual tire pressures
  const [individualTirePressures, setIndividualTirePressures] = useState({
    frontLeft: [32],
    frontRight: [32],
    rearLeft: [35],
    rearRight: [35]
  });

  // Group tire pressures
  const [frontTirePressure, setFrontTirePressure] = useState([32]);
  const [rearTirePressure, setRearTirePressure] = useState([35]);

  const { toast } = useToast();

  // PSI limits
  const MIN_PSI = 0;
  const MAX_PSI = 100;
  const RECOMMENDED_MIN = 25;
  const RECOMMENDED_MAX = 45;

  // Update group pressures when individual pressures change
  useEffect(() => {
    if (tireControlMode === 'individual') {
      const avgFront = (individualTirePressures.frontLeft[0] + individualTirePressures.frontRight[0]) / 2;
      const avgRear = (individualTirePressures.rearLeft[0] + individualTirePressures.rearRight[0]) / 2;
      setFrontTirePressure([avgFront]);
      setRearTirePressure([avgRear]);
    }
  }, [individualTirePressures, tireControlMode]);

  // Update individual pressures when group pressures change
  useEffect(() => {
    if (tireControlMode === 'front') {
      const pressure = frontTirePressure[0];
      setIndividualTirePressures(prev => ({
        ...prev,
        frontLeft: [pressure],
        frontRight: [pressure]
      }));
    } else if (tireControlMode === 'rear') {
      const pressure = rearTirePressure[0];
      setIndividualTirePressures(prev => ({
        ...prev,
        rearLeft: [pressure],
        rearRight: [pressure]
      }));
    }
  }, [frontTirePressure, rearTirePressure, tireControlMode]);

  // AI tire pressure optimization
  useEffect(() => {
    if (aiTireActive && !disabled) {
      const interval = setInterval(() => {
        // AI optimizes based on vehicle conditions
        const speed = vehicleData?.speed || 0;
        const optimalPressure = speed > 80 ? 40 : speed > 50 ? 35 : 32;
        
        setIndividualTirePressures({
          frontLeft: [optimalPressure],
          frontRight: [optimalPressure],
          rearLeft: [optimalPressure + 2],
          rearRight: [optimalPressure + 2]
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [aiTireActive, disabled, vehicleData?.speed]);

  const handleTireControlModeChange = (mode) => {
    setTireControlMode(mode);
    
    let description = '';
    switch(mode) {
      case 'individual':
        description = 'Control independiente de cada neumático';
        break;
      case 'front':
        description = 'Control conjunto de neumáticos delanteros';
        break;
      case 'rear':
        description = 'Control conjunto de neumáticos traseros';
        break;
      case 'ai':
        description = 'IA optimiza presión automáticamente';
        break;
    }
    
    toast({
      title: `Modo de neumáticos: ${mode.toUpperCase()}`,
      description: description,
    });
  };

  const handleAiTireToggle = () => {
    setAiTireActive(!aiTireActive);
    if (!aiTireActive) {
      toast({
        title: "🧠 IA NEUMÁTICOS ACTIVADA",
        description: "Sistema inteligente optimizando presión en tiempo real",
      });
    } else {
      toast({
        title: "IA neumáticos desactivada",
        description: "Control manual restaurado",
      });
    }
  };

  const handleIndividualTireChange = (tire, value) => {
    setIndividualTirePressures(prev => ({
      ...prev,
      [tire]: value
    }));
  };

  const getPressureStatus = (pressure) => {
    if (pressure < RECOMMENDED_MIN) return { status: 'low', color: 'text-red-400', icon: TrendingDown };
    if (pressure > RECOMMENDED_MAX) return { status: 'high', color: 'text-orange-400', icon: TrendingUp };
    return { status: 'optimal', color: 'text-green-400', icon: Target };
  };

  const getAveragePressure = () => {
    return (
      individualTirePressures.frontLeft[0] + 
      individualTirePressures.frontRight[0] + 
      individualTirePressures.rearLeft[0] + 
      individualTirePressures.rearRight[0]
    ) / 4;
  };

  const tireNames = {
    frontLeft: 'Delantero Izquierdo',
    frontRight: 'Delantero Derecho',
    rearLeft: 'Trasero Izquierdo',
    rearRight: 'Trasero Derecho'
  };

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema de Neumáticos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CircleDot className="w-8 h-8 text-orange-400" />
              <h3 className="text-xl font-semibold text-orange-400">
                Sistema de Control de Neumáticos
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                PRESIÓN PROMEDIO: {getAveragePressure().toFixed(1)} PSI
              </Badge>
              <Badge variant={aiTireActive ? "destructive" : "outline-solid"}>
                {aiTireActive ? "🧠 IA ACTIVA" : "MANUAL"}
              </Badge>
            </div>
          </div>
          
          {/* Límites de PSI */}
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400">PSI Mínimo</div>
              <div className="text-red-400 font-bold">{MIN_PSI}</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400">Recomendado Mín</div>
              <div className="text-yellow-400 font-bold">{RECOMMENDED_MIN}</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400">Recomendado Máx</div>
              <div className="text-yellow-400 font-bold">{RECOMMENDED_MAX}</div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400">PSI Máximo</div>
              <div className="text-red-400 font-bold">{MAX_PSI}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modo de Control */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-6">Modo de Control</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant={tireControlMode === 'individual' ? "default" : "outline-solid"}
              onClick={() => handleTireControlModeChange('individual')}
              disabled={disabled}
              className="flex flex-col h-20 space-y-1"
            >
              <Settings className="w-6 h-6" />
              <span className="text-xs">Individual</span>
            </Button>
            
            <Button
              variant={tireControlMode === 'front' ? "default" : "outline-solid"}
              onClick={() => handleTireControlModeChange('front')}
              disabled={disabled}
              className="flex flex-col h-20 space-y-1"
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs">Delanteros</span>
            </Button>
            
            <Button
              variant={tireControlMode === 'rear' ? "default" : "outline-solid"}
              onClick={() => handleTireControlModeChange('rear')}
              disabled={disabled}
              className="flex flex-col h-20 space-y-1"
            >
              <ArrowLeftRight className="w-6 h-6" />
              <span className="text-xs">Traseros</span>
            </Button>
            
            <Button
              variant={aiTireActive ? "destructive" : "outline-solid"}
              onClick={handleAiTireToggle}
              disabled={disabled}
              className="flex flex-col h-20 space-y-1"
            >
              <Brain className="w-6 h-6" />
              <span className="text-xs">IA</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Controles de Presión */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-6">
            {tireControlMode === 'individual' ? 'Control Individual' :
             tireControlMode === 'front' ? 'Control Neumáticos Delanteros' :
             tireControlMode === 'rear' ? 'Control Neumáticos Traseros' :
             'Control por IA'}
          </h4>
          
          {tireControlMode === 'individual' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(individualTirePressures).map(([tire, pressure]) => {
                const status = getPressureStatus(pressure[0]);
                const StatusIcon = status.icon;
                
                return (
                  <div key={tire} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CircleDot className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold text-white">{tireNames[tire]}</span>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <Badge variant="outline" className={status.color}>
                        {pressure[0]} PSI
                      </Badge>
                    </div>
                    
                    <Slider
                      value={pressure}
                      onValueChange={(value) => handleIndividualTireChange(tire, value)}
                      max={MAX_PSI}
                      min={MIN_PSI}
                      step={1}
                      className="w-full"
                      disabled={disabled || aiTireActive}
                    />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{MIN_PSI} PSI</span>
                      <span className="text-yellow-400">{RECOMMENDED_MIN}-{RECOMMENDED_MAX} PSI</span>
                      <span>{MAX_PSI} PSI</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tireControlMode === 'front' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="w-5 h-5 text-blue-400" />
                  <span className="font-semibold text-white">Neumáticos Delanteros</span>
                </div>
                <Badge variant="outline" className="text-blue-400">
                  {frontTirePressure[0]} PSI
                </Badge>
              </div>
              
              <Slider
                value={frontTirePressure}
                onValueChange={setFrontTirePressure}
                max={MAX_PSI}
                min={MIN_PSI}
                step={1}
                className="w-full"
                disabled={disabled || aiTireActive}
              />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{MIN_PSI} PSI</span>
                <span className="text-yellow-400">{RECOMMENDED_MIN}-{RECOMMENDED_MAX} PSI</span>
                <span>{MAX_PSI} PSI</span>
              </div>
            </div>
          )}

          {tireControlMode === 'rear' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-white">Neumáticos Traseros</span>
                </div>
                <Badge variant="outline" className="text-green-400">
                  {rearTirePressure[0]} PSI
                </Badge>
              </div>
              
              <Slider
                value={rearTirePressure}
                onValueChange={setRearTirePressure}
                max={MAX_PSI}
                min={MIN_PSI}
                step={1}
                className="w-full"
                disabled={disabled || aiTireActive}
              />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{MIN_PSI} PSI</span>
                <span className="text-yellow-400">{RECOMMENDED_MIN}-{RECOMMENDED_MAX} PSI</span>
                <span>{MAX_PSI} PSI</span>
              </div>
            </div>
          )}

          {aiTireActive && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <Brain className="w-8 h-8 animate-pulse" />
                <span className="text-lg font-semibold">IA Optimizando Presión</span>
              </div>
              <div className="text-sm text-slate-400">
                La inteligencia artificial ajusta automáticamente la presión de los neumáticos<br/>
                basándose en las condiciones de conducción y velocidad del vehículo
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                {Object.entries(individualTirePressures).map(([tire, pressure]) => (
                  <div key={tire} className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">{tireNames[tire].split(' ')[0]}</div>
                    <div className="text-lg font-bold text-purple-400">{pressure[0]} PSI</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estado de Neumáticos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(individualTirePressures).map(([tire, pressure]) => {
          const status = getPressureStatus(pressure[0]);
          const StatusIcon = status.icon;
          
          return (
            <Card key={tire} className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CircleDot className="w-5 h-5 text-orange-400" />
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>
                <div className="text-xs text-slate-400 mb-2">{tireNames[tire]}</div>
                <div className={`text-xl font-bold ${status.color}`}>
                  {pressure[0]} PSI
                </div>
                <div className="text-xs text-slate-500">
                  {status.status === 'low' ? 'Bajo' : 
                   status.status === 'high' ? 'Alto' : 'Óptimo'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default TireSystem;