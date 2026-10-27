import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  CircleDot, 
  Brain, 
  Settings, 
  Target, 
  ArrowLeftRight, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Gauge,
  Activity,
  Zap,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const EnhancedTireSystem = ({ vehicleData, disabled }) => {
  const [tireControlMode, setTireControlMode] = useState('individual'); // 'individual', 'front', 'rear', 'ai'
  const [aiTireActive, setAiTireActive] = useState(false);
  
  // Presiones individuales con mín/máx y actual
  const [individualTirePressures, setIndividualTirePressures] = useState({
    frontLeft: { current: [32], min: 25, max: 45 },
    frontRight: { current: [32], min: 25, max: 45 },
    rearLeft: { current: [35], min: 25, max: 45 },
    rearRight: { current: [35], min: 25, max: 45 }
  });

  // Presiones grupales
  const [frontTirePressure, setFrontTirePressure] = useState([32]);
  const [rearTirePressure, setRearTirePressure] = useState([35]);
  
  // Configuración de alertas
  const [lowPressureAlert, setLowPressureAlert] = useState(true);
  const [lowPressureThreshold, setLowPressureThreshold] = useState([28]); // PSI
  
  // Estado de alertas
  const [activeAlerts, setActiveAlerts] = useState([]);

  const { toast } = useToast();

  // Límites del sistema
  const MIN_PSI = 0;
  const MAX_PSI = 100;

  // Simular variaciones naturales de presión
  useEffect(() => {
    if (!disabled && !aiTireActive) {
      const interval = setInterval(() => {
        const speed = vehicleData?.speed || 0;
        const tempEffect = Math.random() > 0.7 ? (Math.random() - 0.5) * 2 : 0;
        const speedEffect = speed > 80 ? 1 : speed > 40 ? 0.5 : 0;
        
        setIndividualTirePressures(prev => {
          const newPressures = { ...prev };
          
          Object.keys(newPressures).forEach(tire => {
            const variation = tempEffect + speedEffect + (Math.random() - 0.5) * 0.5;
            const newValue = Math.max(15, Math.min(65, prev[tire].current[0] + variation));
            newPressures[tire] = {
              ...prev[tire],
              current: [Math.round(newValue * 10) / 10]
            };
          });
          
          return newPressures;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [disabled, aiTireActive, vehicleData?.speed]);

  // Actualizar presiones grupales cuando cambian las individuales
  useEffect(() => {
    const avgFront = (
      individualTirePressures.frontLeft.current[0] + 
      individualTirePressures.frontRight.current[0]
    ) / 2;
    const avgRear = (
      individualTirePressures.rearLeft.current[0] + 
      individualTirePressures.rearRight.current[0]
    ) / 2;
    
    setFrontTirePressure([Math.round(avgFront * 10) / 10]);
    setRearTirePressure([Math.round(avgRear * 10) / 10]);
  }, [individualTirePressures]);

  // Monitorear alertas de presión baja
  useEffect(() => {
    if (lowPressureAlert) {
      const alerts = [];
      
      Object.entries(individualTirePressures).forEach(([tire, data]) => {
        if (data.current[0] < lowPressureThreshold[0]) {
          alerts.push({
            tire,
            type: 'low_pressure',
            message: `Presión baja en ${getTireName(tire)}: ${data.current[0]} PSI`
          });
        }
      });
      
      setActiveAlerts(alerts);
      
      // Mostrar toast para nuevas alertas
      if (alerts.length > 0 && activeAlerts.length !== alerts.length) {
        toast({
          title: '⚠️ Alerta de Presión Baja',
          description: `${alerts.length} neumático(s) por debajo del umbral`,
        });
      }
    } else {
      setActiveAlerts([]);
    }
  }, [individualTirePressures, lowPressureThreshold, lowPressureAlert]);

  // Sistema de IA para optimización automática
  useEffect(() => {
    if (aiTireActive && !disabled) {
      const interval = setInterval(() => {
        const speed = vehicleData?.speed || 0;
        const terrain = Math.random() > 0.5 ? 'asphalt' : 'offroad';
        
        let optimalPressures = {};
        
        if (terrain === 'offroad') {
          // Presiones más bajas para mejor tracción off-road
          optimalPressures = {
            frontLeft: { current: [28], min: 20, max: 35 },
            frontRight: { current: [28], min: 20, max: 35 },
            rearLeft: { current: [26], min: 20, max: 35 },
            rearRight: { current: [26], min: 20, max: 35 }
          };
        } else {
          // Presiones optimizadas para velocidad y asfalto
          const basePressure = speed > 100 ? 42 : speed > 60 ? 38 : 34;
          optimalPressures = {
            frontLeft: { current: [basePressure], min: 30, max: 50 },
            frontRight: { current: [basePressure], min: 30, max: 50 },
            rearLeft: { current: [basePressure + 2], min: 30, max: 50 },
            rearRight: { current: [basePressure + 2], min: 30, max: 50 }
          };
        }
        
        setIndividualTirePressures(optimalPressures);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [aiTireActive, disabled, vehicleData?.speed]);

  const handleTireControlModeChange = (mode) => {
    setTireControlMode(mode);
    
    const descriptions = {
      individual: 'Control independiente de cada neumático',
      front: 'Control conjunto de neumáticos delanteros',
      rear: 'Control conjunto de neumáticos traseros',
      ai: 'IA optimiza presión según condiciones'
    };
    
    toast({
      title: `Modo: ${mode.toUpperCase()}`,
      description: descriptions[mode],
    });
  };

  const handleAiTireToggle = () => {
    setAiTireActive(!aiTireActive);
    if (!aiTireActive) {
      toast({
        title: "🧠 IA NEUMÁTICOS ACTIVADA",
        description: "Optimizando presiones según condiciones de conducción",
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
      [tire]: {
        ...prev[tire],
        current: value
      }
    }));
  };

  const handleGroupPressureChange = (group, value) => {
    if (group === 'front') {
      setFrontTirePressure(value);
      setIndividualTirePressures(prev => ({
        ...prev,
        frontLeft: { ...prev.frontLeft, current: value },
        frontRight: { ...prev.frontRight, current: value }
      }));
    } else if (group === 'rear') {
      setRearTirePressure(value);
      setIndividualTirePressures(prev => ({
        ...prev,
        rearLeft: { ...prev.rearLeft, current: value },
        rearRight: { ...prev.rearRight, current: value }
      }));
    }
  };

  const getTireName = (tire) => {
    const names = {
      frontLeft: 'Delantero Izquierdo',
      frontRight: 'Delantero Derecho',
      rearLeft: 'Trasero Izquierdo',
      rearRight: 'Trasero Derecho'
    };
    return names[tire];
  };

  const getPressureStatus = (current, min, max, threshold) => {
    if (current < threshold) return { status: 'critical', color: 'text-red-400', icon: XCircle };
    if (current < min) return { status: 'low', color: 'text-orange-400', icon: TrendingDown };
    if (current > max) return { status: 'high', color: 'text-yellow-400', icon: TrendingUp };
    return { status: 'optimal', color: 'text-green-400', icon: CheckCircle };
  };

  const getAveragePressure = () => {
    return Object.values(individualTirePressures)
      .reduce((acc, tire) => acc + tire.current[0], 0) / 4;
  };

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema Avanzado de Neumáticos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CircleDot className="w-8 h-8 text-orange-400" />
              <h3 className="text-xl font-semibold text-orange-400">
                Sistema Avanzado de Neumáticos
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                PRESIÓN PROMEDIO: {getAveragePressure().toFixed(1)} PSI
              </Badge>
              <Badge variant={aiTireActive ? "destructive" : "outline-solid"}>
                {aiTireActive ? "🧠 IA ACTIVA" : "MANUAL"}
              </Badge>
              {activeAlerts.length > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  ⚠️ {activeAlerts.length} ALERTA(S)
                </Badge>
              )}
            </div>
          </div>
          
          {/* Resumen de Estado */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {Object.entries(individualTirePressures).map(([tire, data]) => {
              const status = getPressureStatus(
                data.current[0], 
                data.min, 
                data.max, 
                lowPressureThreshold[0]
              );
              const StatusIcon = status.icon;
              
              return (
                <div key={tire} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-center justify-center space-x-1 mb-1">
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <span className="text-xs text-slate-400">{getTireName(tire).split(' ')[0]}</span>
                  </div>
                  <div className={`text-lg font-bold ${status.color}`}>
                    {data.current[0].toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-500">
                    {data.min}-{data.max} PSI
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alertas Activas */}
      {activeAlerts.length > 0 && (
        <Card className="bg-red-900/20 border-red-500/50 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Alertas de Presión
            </h4>
            
            <div className="space-y-2">
              {activeAlerts.map((alert, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-900/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span className="text-white">{alert.message}</span>
                  </div>
                  <Badge variant="destructive" className="text-xs">
                    CRÍTICO
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <ArrowLeftRight className="w-6 h-6 rotate-90" />
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
            Ajuste de Presión - {
              tireControlMode === 'individual' ? 'Control Individual' :
              tireControlMode === 'front' ? 'Neumáticos Delanteros' :
              tireControlMode === 'rear' ? 'Neumáticos Traseros' :
              'Control por IA'
            }
          </h4>
          
          {tireControlMode === 'individual' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(individualTirePressures).map(([tire, data]) => {
                const status = getPressureStatus(
                  data.current[0], 
                  data.min, 
                  data.max, 
                  lowPressureThreshold[0]
                );
                const StatusIcon = status.icon;
                
                return (
                  <div key={tire} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CircleDot className="w-5 h-5 text-orange-400" />
                        <span className="font-semibold text-white">{getTireName(tire)}</span>
                        <StatusIcon className={`w-4 h-4 ${status.color}`} />
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className={status.color}>
                          {data.current[0].toFixed(1)} PSI
                        </Badge>
                        <div className="text-xs text-slate-400 mt-1">
                          Rango: {data.min}-{data.max} PSI
                        </div>
                      </div>
                    </div>
                    
                    <Slider
                      value={data.current}
                      onValueChange={(value) => handleIndividualTireChange(tire, value)}
                      max={MAX_PSI}
                      min={MIN_PSI}
                      step={0.5}
                      className="w-full"
                      disabled={disabled || aiTireActive}
                    />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{MIN_PSI} PSI</span>
                      <span className="text-yellow-400">{data.min}-{data.max} PSI (óptimo)</span>
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
                  {frontTirePressure[0].toFixed(1)} PSI
                </Badge>
              </div>
              
              <Slider
                value={frontTirePressure}
                onValueChange={(value) => handleGroupPressureChange('front', value)}
                max={MAX_PSI}
                min={MIN_PSI}
                step={0.5}
                className="w-full"
                disabled={disabled || aiTireActive}
              />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{MIN_PSI} PSI</span>
                <span className="text-yellow-400">25-45 PSI (recomendado)</span>
                <span>{MAX_PSI} PSI</span>
              </div>
            </div>
          )}

          {tireControlMode === 'rear' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ArrowLeftRight className="w-5 h-5 text-green-400 rotate-90" />
                  <span className="font-semibold text-white">Neumáticos Traseros</span>
                </div>
                <Badge variant="outline" className="text-green-400">
                  {rearTirePressure[0].toFixed(1)} PSI
                </Badge>
              </div>
              
              <Slider
                value={rearTirePressure}
                onValueChange={(value) => handleGroupPressureChange('rear', value)}
                max={MAX_PSI}
                min={MIN_PSI}
                step={0.5}
                className="w-full"
                disabled={disabled || aiTireActive}
              />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>{MIN_PSI} PSI</span>
                <span className="text-yellow-400">25-45 PSI (recomendado)</span>
                <span>{MAX_PSI} PSI</span>
              </div>
            </div>
          )}

          {aiTireActive && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-purple-400">
                <Brain className="w-8 h-8 animate-pulse" />
                <span className="text-lg font-semibold">IA Optimizando Presiones</span>
              </div>
              <div className="text-sm text-slate-400">
                La inteligencia artificial ajusta automáticamente las presiones<br/>
                basándose en velocidad, terreno y condiciones de conducción
              </div>
              <div className="grid grid-cols-4 gap-4 mt-6">
                {Object.entries(individualTirePressures).map(([tire, data]) => (
                  <div key={tire} className="text-center p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">
                      {getTireName(tire).split(' ')[0]}
                    </div>
                    <div className="text-lg font-bold text-purple-400">
                      {data.current[0].toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-500">PSI</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Alertas */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-yellow-400 mb-6">Configuración de Alertas</h4>
          
          <div className="space-y-6">
            
            {/* Activar/Desactivar Alertas */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <div className="font-semibold text-white">Alertas de Presión Baja</div>
                <div className="text-xs text-slate-400">
                  Notificar cuando la presión esté por debajo del umbral
                </div>
              </div>
              <Switch
                checked={lowPressureAlert}
                onCheckedChange={setLowPressureAlert}
                disabled={disabled}
              />
            </div>

            {/* Configurar Umbral */}
            {lowPressureAlert && (
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-300">
                    Umbral de Presión Baja:
                  </span>
                  <Badge variant="outline" className="text-yellow-400">
                    {lowPressureThreshold[0]} PSI
                  </Badge>
                </div>
                
                <Slider
                  value={lowPressureThreshold}
                  onValueChange={setLowPressureThreshold}
                  min={15}
                  max={35}
                  step={1}
                  className="w-full"
                  disabled={disabled}
                />
                
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>15 PSI (Crítico)</span>
                  <span>25 PSI (Conservador)</span>
                  <span>35 PSI (Precautorio)</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estado Detallado de Neumáticos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(individualTirePressures).map(([tire, data]) => {
          const status = getPressureStatus(
            data.current[0], 
            data.min, 
            data.max, 
            lowPressureThreshold[0]
          );
          const StatusIcon = status.icon;
          
          return (
            <Card key={tire} className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <CircleDot className="w-5 h-5 text-orange-400" />
                  <StatusIcon className={`w-4 h-4 ${status.color}`} />
                </div>
                <div className="text-xs text-slate-400 mb-2">{getTireName(tire)}</div>
                <div className={`text-xl font-bold ${status.color}`}>
                  {data.current[0].toFixed(1)}
                </div>
                <div className="text-xs text-slate-500 mb-1">PSI</div>
                <Progress 
                  value={(data.current[0] / MAX_PSI) * 100} 
                  className="h-2" 
                />
                <div className="text-xs text-slate-500 mt-1">
                  {status.status === 'critical' ? '🚨 Crítico' : 
                   status.status === 'low' ? '⚠️ Bajo' : 
                   status.status === 'high' ? '📈 Alto' : '✅ Óptimo'}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnhancedTireSystem;