import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  Zap, 
  Sun, 
  Shield, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  AlertTriangle,
  CheckCircle,
  Timer
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const UVHygienizationSystem = ({ vehicleData, disabled }) => {
  const [uvSystemActive, setUvSystemActive] = useState(false);
  const [autoActivationEnabled, setAutoActivationEnabled] = useState(true);
  const [inactivityThreshold, setInactivityThreshold] = useState([20]); // minutos
  const [uvCycleProgress, setUvCycleProgress] = useState(0);
  const [vehicleInactiveTime, setVehicleInactiveTime] = useState(0); // minutos
  const [uvCycleTimeRemaining, setUvCycleTimeRemaining] = useState(0);
  
  const { toast } = useToast();

  // Duración del ciclo UV en segundos (simulado como más rápido para demo)
  const UV_CYCLE_DURATION = 30; // 30 segundos para demo (en realidad sería más tiempo)

  // Simular tiempo de inactividad del vehículo
  useEffect(() => {
    if (!disabled) {
      const interval = setInterval(() => {
        const isVehicleActive = (vehicleData?.speed || 0) > 0;
        
        if (!isVehicleActive && !uvSystemActive) {
          setVehicleInactiveTime(prev => prev + 0.1); // Incrementar cada 6 segundos (simulado)
        } else if (isVehicleActive) {
          setVehicleInactiveTime(0); // Reset cuando el vehículo está activo
        }
      }, 6000); // Cada 6 segundos para simulación rápida

      return () => clearInterval(interval);
    }
  }, [disabled, vehicleData?.speed, uvSystemActive]);

  // Activación automática por inactividad
  useEffect(() => {
    if (autoActivationEnabled && 
        vehicleInactiveTime >= inactivityThreshold[0] && 
        !uvSystemActive && 
        !disabled) {
      
      startUVCycle(true); // true indica activación automática
    }
  }, [vehicleInactiveTime, inactivityThreshold, autoActivationEnabled, uvSystemActive, disabled]);

  // Control del progreso del ciclo UV
  useEffect(() => {
    let interval;
    if (uvSystemActive && !disabled) {
      interval = setInterval(() => {
        setUvCycleProgress(prev => {
          const newProgress = prev + (100 / UV_CYCLE_DURATION);
          if (newProgress >= 100) {
            completeUVCycle();
            return 100;
          }
          return newProgress;
        });
        
        setUvCycleTimeRemaining(prev => {
          const remaining = prev - 1;
          return remaining <= 0 ? 0 : remaining;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [uvSystemActive, disabled]);

  const startUVCycle = (isAutomatic = false) => {
    setUvSystemActive(true);
    setUvCycleProgress(0);
    setUvCycleTimeRemaining(UV_CYCLE_DURATION);
    
    toast({
      title: isAutomatic ? '🤖 Higienización UV Automática' : '🦠 Higienización UV Iniciada',
      description: isAutomatic ? 
        `Activada por inactividad de ${inactivityThreshold[0]} min` : 
        'Ciclo de higienización UV en progreso',
    });
  };

  const stopUVCycle = () => {
    setUvSystemActive(false);
    setUvCycleProgress(0);
    setUvCycleTimeRemaining(0);
    
    toast({
      title: 'Higienización UV Detenida',
      description: 'Ciclo interrumpido manualmente',
    });
  };

  const completeUVCycle = () => {
    setUvSystemActive(false);
    setUvCycleProgress(100);
    setUvCycleTimeRemaining(0);
    setVehicleInactiveTime(0); // Reset inactivity time
    
    toast({
      title: '✅ Higienización UV Completada',
      description: 'Tapicería higienizada correctamente',
    });
    
    // Reset progress after showing completion
    setTimeout(() => {
      setUvCycleProgress(0);
    }, 3000);
  };

  const handleThresholdChange = (value) => {
    setInactivityThreshold(value);
    toast({
      title: `Umbral actualizado: ${value[0]} minutos`,
      description: 'El sistema se activará automáticamente tras este período de inactividad',
    });
  };

  const getUVIntensity = () => {
    if (!uvSystemActive) return 0;
    return Math.min(100, uvCycleProgress * 1.2); // Intensidad aumenta con el progreso
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema UV */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Sun className="w-8 h-8 text-purple-400" />
              <h3 className="text-xl font-semibold text-purple-400">
                Sistema de Higienización UV
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={uvSystemActive ? "destructive" : "outline-solid"}>
                {uvSystemActive ? "🦠 HIGIENIZANDO" : "INACTIVO"}
              </Badge>
              <Badge variant={autoActivationEnabled ? "default" : "outline-solid"}>
                {autoActivationEnabled ? "AUTO" : "MANUAL"}
              </Badge>
            </div>
          </div>
          
          {/* Estado del sistema */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Tiempo Inactivo</div>
              <div className="text-xl font-bold text-cyan-400">
                {vehicleInactiveTime.toFixed(1)} min
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Intensidad UV</div>
              <div className="text-xl font-bold text-purple-400">
                {getUVIntensity().toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Tiempo Restante</div>
              <div className="text-xl font-bold text-green-400">
                {formatTime(uvCycleTimeRemaining)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles del Sistema */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6">Controles de Higienización</h4>
          
          <div className="space-y-6">
            
            {/* Control Manual */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div>
                <div className="font-semibold text-white">Control Manual</div>
                <div className="text-xs text-slate-400">
                  {uvSystemActive ? 'Higienización UV en progreso' : 'Iniciar ciclo de higienización UV'}
                </div>
              </div>
              <div className="flex space-x-2">
                {!uvSystemActive ? (
                  <Button
                    variant="default"
                    onClick={() => startUVCycle(false)}
                    disabled={disabled}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar UV
                  </Button>
                ) : (
                  <Button
                    variant="destructive"
                    onClick={stopUVCycle}
                    disabled={disabled}
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Detener
                  </Button>
                )}
              </div>
            </div>

            {/* Activación Automática */}
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-white">Activación Automática</div>
                  <div className="text-xs text-slate-400">
                    Activar UV automáticamente tras inactividad
                  </div>
                </div>
                <Switch
                  checked={autoActivationEnabled}
                  onCheckedChange={setAutoActivationEnabled}
                  disabled={disabled}
                />
              </div>
              
              {autoActivationEnabled && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Tiempo de Inactividad para Activación:
                    </span>
                    <Badge variant="outline" className="text-cyan-400">
                      {inactivityThreshold[0]} minutos
                    </Badge>
                  </div>
                  
                  <Slider
                    value={inactivityThreshold}
                    onValueChange={handleThresholdChange}
                    min={10}
                    max={30}
                    step={10}
                    className="w-full"
                    disabled={disabled}
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>10 min</span>
                    <span>20 min</span>
                    <span>30 min</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progreso del Ciclo UV */}
      {(uvSystemActive || uvCycleProgress > 0) && (
        <Card className="bg-slate-900/50 border-purple-500/50 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Ciclo de Higienización UV en Progreso
            </h4>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {uvCycleProgress.toFixed(0)}%
                </div>
                <Progress 
                  value={uvCycleProgress} 
                  className="w-full h-3" 
                />
              </div>
              
              {/* Visualización de cobertura UV */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Asientos Delanteros', 'Asientos Traseros', 'Volante y Panel', 'Superficies'].map((area, index) => {
                  const coverageDelay = index * 25; // Cada área se cubre progresivamente
                  const areaCoverage = Math.max(0, Math.min(100, uvCycleProgress - coverageDelay));
                  
                  return (
                    <div key={area} className="text-center p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">{area}</div>
                      <div className={`text-sm font-bold ${
                        areaCoverage >= 100 ? 'text-green-400' : 
                        areaCoverage > 0 ? 'text-purple-400' : 'text-slate-500'
                      }`}>
                        {areaCoverage >= 100 ? (
                          <CheckCircle className="w-4 h-4 mx-auto" />
                        ) : areaCoverage > 0 ? (
                          <Sun className="w-4 h-4 mx-auto animate-pulse" />
                        ) : (
                          <Shield className="w-4 h-4 mx-auto" />
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        {areaCoverage.toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {uvSystemActive && (
                <div className="text-center text-sm text-slate-400">
                  <Timer className="w-4 h-4 inline mr-1" />
                  Tiempo restante: {formatTime(uvCycleTimeRemaining)}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estado de Higiene */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Shield className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-lg font-bold text-green-400">
              {uvCycleProgress >= 100 ? '✅ Higienizado' : 
               uvSystemActive ? '🦠 Higienizando' : '⏳ Pendiente'}
            </div>
            <div className="text-xs text-slate-400">Estado de Higiene</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-lg font-bold text-blue-400">
              {vehicleInactiveTime >= inactivityThreshold[0] && autoActivationEnabled && !uvSystemActive ? 
                '🤖 Auto-Activación' : 
                `⏱️ ${inactivityThreshold[0]} min`}
            </div>
            <div className="text-xs text-slate-400">Configuración Auto</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UVHygienizationSystem;