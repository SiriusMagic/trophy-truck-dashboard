import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  Fan, 
  Wind, 
  Disc, 
  Thermometer, 
  Gauge, 
  Power, 
  AlertTriangle,
  Play,
  Pause,
  Settings,
  Activity,
  TrendingUp,
  Eye,
  Zap
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CompressorSystem = ({ vehicleData, disabled }) => {
  const [compressorActive, setCompressorActive] = useState(false);
  const [compressorMode, setCompressorMode] = useState('ventilation'); // 'ventilation', 'brake_cooling', 'both'
  const [compressorSpeed, setCompressorSpeed] = useState([50]); // Porcentaje de velocidad
  const [outputPressure, setOutputPressure] = useState([35]); // PSI ajustable
  
  // Estados de entrada (inputs)
  const [filtersActive, setFiltersActive] = useState(true);
  const [brakeTemps, setBrakeTemps] = useState({
    frontLeft: 185,
    frontRight: 180,
    rearLeft: 165,
    rearRight: 170
  });
  
  // Configuración automática
  const [autoBreakeCooling, setAutoBreakeCooling] = useState(true);
  const [brakesTempThreshold, setBrakesTempThreshold] = useState([250]); // °C
  
  // Estado del sistema
  const [systemStatus, setSystemStatus] = useState({
    motorRPM: 0,
    powerConsumption: 0,
    efficiency: 0,
    temperature: 25
  });
  
  const { toast } = useToast();

  // Simular temperaturas de frenos basadas en velocidad del vehículo
  useEffect(() => {
    if (!disabled) {
      const interval = setInterval(() => {
        const speed = vehicleData?.speed || 0;
        const isHardBraking = Math.random() > 0.85;
        const isCoolingActive = compressorActive && (compressorMode === 'brake_cooling' || compressorMode === 'both');
        
        setBrakeTemps(prev => {
          const tempIncrease = isHardBraking ? 15 : (speed > 60 ? 3 : -1);
          const coolingEffect = isCoolingActive ? -8 : 0;
          
          return {
            frontLeft: Math.max(120, Math.min(400, prev.frontLeft + tempIncrease + coolingEffect + (Math.random() - 0.5) * 5)),
            frontRight: Math.max(120, Math.min(400, prev.frontRight + tempIncrease + coolingEffect + (Math.random() - 0.5) * 5)),
            rearLeft: Math.max(110, Math.min(380, prev.rearLeft + (tempIncrease * 0.8) + coolingEffect + (Math.random() - 0.5) * 4)),
            rearRight: Math.max(110, Math.min(380, prev.rearRight + (tempIncrease * 0.8) + coolingEffect + (Math.random() - 0.5) * 4))
          };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [disabled, vehicleData?.speed, compressorActive, compressorMode]);

  // Activación automática por temperatura de frenos
  useEffect(() => {
    if (autoBreakeCooling && !disabled) {
      const maxBrakeTemp = Math.max(
        brakeTemps.frontLeft,
        brakeTemps.frontRight,
        brakeTemps.rearLeft,
        brakeTemps.rearRight
      );
      
      if (maxBrakeTemp >= brakesTempThreshold[0] && (!compressorActive || compressorMode === 'ventilation')) {
        activateBrakeCooling(true); // true indica activación automática
      }
    }
  }, [brakeTemps, brakesTempThreshold, autoBreakeCooling, compressorActive, compressorMode, disabled]);

  // Actualizar estado del sistema basado en configuración
  useEffect(() => {
    if (compressorActive) {
      const baseRPM = (compressorSpeed[0] / 100) * 3500;
      const loadFactor = compressorMode === 'both' ? 1.3 : compressorMode === 'brake_cooling' ? 1.1 : 1.0;
      
      setSystemStatus(prev => ({
        motorRPM: Math.round(baseRPM * loadFactor),
        powerConsumption: Math.round((compressorSpeed[0] / 100) * 45 * loadFactor * 10) / 10,
        efficiency: Math.round((100 - (compressorSpeed[0] * 0.2) + Math.random() * 5) * 10) / 10,
        temperature: Math.round(25 + (compressorSpeed[0] * 0.6) + (loadFactor - 1) * 20)
      }));
      
      // Calcular presión de salida basada en velocidad del compresor
      const calculatedPressure = Math.round((baseRPM / 3500) * 50 + 15);
      setOutputPressure([calculatedPressure]);
    } else {
      setSystemStatus({
        motorRPM: 0,
        powerConsumption: 0,
        efficiency: 0,
        temperature: 25
      });
    }
  }, [compressorActive, compressorSpeed, compressorMode]);

  const activateCompressor = (mode, manual = false) => {
    setCompressorActive(true);
    setCompressorMode(mode);
    
    const descriptions = {
      ventilation: 'Activado para ventilación de cabina',
      brake_cooling: manual ? 'Activado manualmente para enfriamiento de frenos' : 'Activado automáticamente para enfriamiento de frenos',
      both: 'Activado para ventilación y enfriamiento'
    };
    
    toast({
      title: `🌪️ Compresor ${manual ? 'Manual' : 'Automático'}`,
      description: descriptions[mode],
    });
  };

  const activateBrakeCooling = (isAutomatic = false) => {
    activateCompressor('brake_cooling', !isAutomatic);
  };

  const deactivateCompressor = () => {
    setCompressorActive(false);
    setCompressorMode('ventilation');
    
    toast({
      title: 'Compresor Desactivado',
      description: 'Sistema detenido manualmente',
    });
  };

  const handleSpeedChange = (value) => {
    setCompressorSpeed(value);
  };

  const handlePressureChange = (value) => {
    setOutputPressure(value);
    // Ajustar velocidad del compresor para alcanzar la presión deseada
    const requiredSpeed = Math.round(((value[0] - 15) / 50) * 100);
    setCompressorSpeed([Math.min(100, Math.max(20, requiredSpeed))]);
  };

  const getMaxBrakeTemp = () => {
    return Math.max(
      brakeTemps.frontLeft,
      brakeTemps.frontRight,
      brakeTemps.rearLeft,
      brakeTemps.rearRight
    );
  };

  const getBrakeStatus = (temp) => {
    if (temp >= brakesTempThreshold[0]) return { status: 'critical', color: 'text-red-400' };
    if (temp >= brakesTempThreshold[0] * 0.8) return { status: 'warning', color: 'text-orange-400' };
    return { status: 'normal', color: 'text-green-400' };
  };

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema de Compresor */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Fan className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-400">
                Sistema de Compresor Inteligente
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={compressorActive ? "destructive" : "outline-solid"}>
                {compressorActive ? "🌪️ ACTIVO" : "INACTIVO"}
              </Badge>
              <Badge variant="outline" className="text-blue-400">
                {compressorMode.toUpperCase().replace('_', ' ')}
              </Badge>
            </div>
          </div>
          
          {/* Estado del Sistema */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">RPM Motor</div>
              <div className="text-xl font-bold text-blue-400">
                {systemStatus.motorRPM.toLocaleString()}
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Presión Salida</div>
              <div className="text-xl font-bold text-purple-400">
                {outputPressure[0]} PSI
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Consumo</div>
              <div className="text-xl font-bold text-yellow-400">
                {systemStatus.powerConsumption} kW
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Temp. Max Frenos</div>
              <div className={`text-xl font-bold ${getBrakeStatus(getMaxBrakeTemp()).color}`}>
                {getMaxBrakeTemp().toFixed(0)}°C
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles Manuales */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6">Controles Manuales</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Control de Ventilación */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Wind className="w-6 h-6 text-cyan-400" />
                  <div>
                    <div className="font-semibold text-white">Ventilación de Cabina</div>
                    <div className="text-xs text-slate-400">
                      Mantiene flujo de aire y presión constante
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={filtersActive}
                    onCheckedChange={setFiltersActive}
                    disabled={disabled}
                  />
                  <span className="text-xs text-slate-400">Filtros</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={compressorActive && compressorMode === 'ventilation' ? "default" : "outline-solid"}
                  onClick={() => activateCompressor('ventilation', true)}
                  disabled={disabled}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ventilación
                </Button>
                
                {compressorActive && compressorMode !== 'brake_cooling' && (
                  <Button
                    variant="destructive"
                    onClick={deactivateCompressor}
                    disabled={disabled}
                  >
                    <Pause className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Control de Enfriamiento de Frenos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Disc className="w-6 h-6 text-red-400" />
                  <div>
                    <div className="font-semibold text-white">Enfriamiento de Frenos</div>
                    <div className="text-xs text-slate-400">
                      Aire forzado para enfriamiento rápido
                    </div>
                  </div>
                </div>
                {getMaxBrakeTemp() >= brakesTempThreshold[0] && (
                  <div className="flex items-center text-red-400 text-xs animate-pulse">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    Temp. Alta
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant={compressorActive && compressorMode === 'brake_cooling' ? "destructive" : "outline-solid"}
                  onClick={() => activateBrakeCooling(false)}
                  disabled={disabled}
                  className="flex-1"
                >
                  <Disc className="w-4 h-4 mr-2" />
                  Enfriar Frenos
                </Button>
                
                <Button
                  variant={compressorActive && compressorMode === 'both' ? "default" : "outline-solid"}
                  onClick={() => activateCompressor('both', true)}
                  disabled={disabled}
                  className="flex-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Ambos
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configuración del Compresor */}
      {compressorActive && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-purple-400 mb-6">Configuración de Potencia</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Control de Velocidad */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-400" />
                    <span className="font-semibold text-white">Velocidad del Compresor</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-400">
                    {compressorSpeed[0]}%
                  </Badge>
                </div>
                
                <Slider
                  value={compressorSpeed}
                  onValueChange={handleSpeedChange}
                  min={20}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>20% (Mín)</span>
                  <span>60% (Normal)</span>
                  <span>100% (Máx)</span>
                </div>
              </div>

              {/* Control de Presión */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    <span className="font-semibold text-white">Presión de Salida</span>
                  </div>
                  <Badge variant="outline" className="text-purple-400">
                    {outputPressure[0]} PSI
                  </Badge>
                </div>
                
                <Slider
                  value={outputPressure}
                  onValueChange={handlePressureChange}
                  min={15}
                  max={65}
                  step={1}
                  className="w-full"
                  disabled={disabled}
                />
                
                <div className="flex justify-between text-xs text-slate-500">
                  <span>15 PSI (Mín)</span>
                  <span>35-45 PSI (Óptimo)</span>
                  <span>65 PSI (Máx)</span>
                </div>
              </div>
            </div>

            {/* Métricas en Tiempo Real */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-400">RPM</div>
                <div className="text-lg font-bold text-blue-400">
                  {systemStatus.motorRPM.toLocaleString()}
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-400">Consumo</div>
                <div className="text-lg font-bold text-yellow-400">
                  {systemStatus.powerConsumption} kW
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-400">Eficiencia</div>
                <div className="text-lg font-bold text-green-400">
                  {systemStatus.efficiency.toFixed(1)}%
                </div>
              </div>
              
              <div className="text-center p-3 bg-slate-800/50 rounded-lg">
                <div className="text-xs text-slate-400">Temperatura</div>
                <div className="text-lg font-bold text-orange-400">
                  {systemStatus.temperature}°C
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuración Automática */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-orange-400 mb-6">Configuración Automática</h4>
          
          <div className="space-y-6">
            
            {/* Activación Automática por Temperatura */}
            <div className="p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="font-semibold text-white">Enfriamiento Automático</div>
                  <div className="text-xs text-slate-400">
                    Activar compresor automáticamente cuando los frenos se sobrecalienten
                  </div>
                </div>
                <Switch
                  checked={autoBreakeCooling}
                  onCheckedChange={setAutoBreakeCooling}
                  disabled={disabled}
                />
              </div>
              
              {autoBreakeCooling && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Umbral de Temperatura:
                    </span>
                    <Badge variant="outline" className="text-orange-400">
                      {brakesTempThreshold[0]}°C
                    </Badge>
                  </div>
                  
                  <Slider
                    value={brakesTempThreshold}
                    onValueChange={setBrakesTempThreshold}
                    min={200}
                    max={350}
                    step={10}
                    className="w-full"
                    disabled={disabled}
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>200°C (Conservador)</span>
                    <span>275°C (Estándar)</span>
                    <span>350°C (Agresivo)</span>
                  </div>
                </div>
              )}
            </div>

            {/* Estado de Entradas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Estado de Filtros */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="text-xs text-slate-400">FILTROS</span>
                </div>
                <div className={`text-lg font-bold ${filtersActive ? 'text-green-400' : 'text-red-400'}`}>
                  {filtersActive ? 'ACTIVOS' : 'INACTIVOS'}
                </div>
                <div className="text-xs text-slate-500">
                  {filtersActive ? 'Requiere presión constante' : 'Flujo libre'}
                </div>
              </div>

              {/* Temperatura Máxima */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Thermometer className={`w-5 h-5 ${getBrakeStatus(getMaxBrakeTemp()).color}`} />
                  <span className="text-xs text-slate-400">TEMP. MÁX</span>
                </div>
                <div className={`text-lg font-bold ${getBrakeStatus(getMaxBrakeTemp()).color}`}>
                  {getMaxBrakeTemp().toFixed(0)}°C
                </div>
                <div className="text-xs text-slate-500">
                  {getMaxBrakeTemp() >= brakesTempThreshold[0] ? 'Activación automática' : 'Normal'}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoreo de Temperatura de Frenos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-red-400 mb-6 flex items-center">
            <Disc className="w-5 h-5 mr-2" />
            Estado Actual de Frenos
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(brakeTemps).map(([brake, temp]) => {
              const status = getBrakeStatus(temp);
              const brakeNames = {
                frontLeft: 'Delantero Izq.',
                frontRight: 'Delantero Der.',
                rearLeft: 'Trasero Izq.',
                rearRight: 'Trasero Der.'
              };
              
              return (
                <div key={brake} className="p-4 bg-slate-800/50 rounded-lg text-center">
                  <div className="text-xs text-slate-400 mb-2">{brakeNames[brake]}</div>
                  <div className={`text-xl font-bold ${status.color}`}>
                    {temp.toFixed(0)}°C
                  </div>
                  <Progress 
                    value={(temp / 400) * 100} 
                    className="h-2 mt-2" 
                  />
                  <div className="text-xs text-slate-500 mt-1">
                    {status.status === 'critical' ? '🚨 Crítico' : 
                     status.status === 'warning' ? '⚠️ Alerta' : '✅ Normal'}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompressorSystem;