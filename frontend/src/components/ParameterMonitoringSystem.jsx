import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Wind, 
  Gauge, 
  Thermometer, 
  Activity, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
  Disc,
  Zap
} from 'lucide-react';

const ParameterMonitoringSystem = ({ vehicleData, disabled }) => {
  const [airflowData, setAirflowData] = useState({
    intake: 125.5, // L/min
    exhaust: 118.2,
    filterEfficiency: 94.5
  });
  
  const [compressorData, setCompressorData] = useState({
    outputPressure: 42.3, // PSI
    motorRPM: 2850,
    temperature: 68.4,
    efficiency: 91.2
  });
  
  const [brakeData, setBrakeData] = useState({
    frontLeft: { padTemp: 185, discTemp: 210 },
    frontRight: { padTemp: 178, discTemp: 205 },
    rearLeft: { padTemp: 165, discTemp: 190 },
    rearRight: { padTemp: 170, discTemp: 195 }
  });

  // Simular datos en tiempo real
  useEffect(() => {
    if (!disabled) {
      const interval = setInterval(() => {
        const speed = vehicleData?.speed || 0;
        const isHardBraking = Math.random() > 0.85;
        
        // Actualizar datos de flujo de aire
        setAirflowData(prev => ({
          intake: Math.max(80, Math.min(200, prev.intake + (Math.random() - 0.5) * 10)),
          exhaust: Math.max(75, Math.min(190, prev.exhaust + (Math.random() - 0.5) * 8)),
          filterEfficiency: Math.max(85, Math.min(98, prev.filterEfficiency + (Math.random() - 0.5) * 2))
        }));
        
        // Actualizar datos del compresor
        setCompressorData(prev => ({
          outputPressure: Math.max(35, Math.min(65, prev.outputPressure + (Math.random() - 0.5) * 3)),
          motorRPM: Math.max(2000, Math.min(4000, prev.motorRPM + (Math.random() - 0.5) * 200)),
          temperature: Math.max(45, Math.min(85, prev.temperature + (Math.random() - 0.5) * 2)),
          efficiency: Math.max(80, Math.min(95, prev.efficiency + (Math.random() - 0.5) * 1))
        }));
        
        // Actualizar datos de frenos (aumentan con velocidad y frenado)
        setBrakeData(prev => {
          const tempIncrease = isHardBraking ? 15 : (speed > 60 ? 5 : -2);
          
          return {
            frontLeft: {
              padTemp: Math.max(120, Math.min(350, prev.frontLeft.padTemp + tempIncrease + (Math.random() - 0.5) * 8)),
              discTemp: Math.max(140, Math.min(400, prev.frontLeft.discTemp + tempIncrease + (Math.random() - 0.5) * 10))
            },
            frontRight: {
              padTemp: Math.max(120, Math.min(350, prev.frontRight.padTemp + tempIncrease + (Math.random() - 0.5) * 8)),
              discTemp: Math.max(140, Math.min(400, prev.frontRight.discTemp + tempIncrease + (Math.random() - 0.5) * 10))
            },
            rearLeft: {
              padTemp: Math.max(110, Math.min(320, prev.rearLeft.padTemp + (tempIncrease * 0.8) + (Math.random() - 0.5) * 6)),
              discTemp: Math.max(130, Math.min(370, prev.rearLeft.discTemp + (tempIncrease * 0.8) + (Math.random() - 0.5) * 8))
            },
            rearRight: {
              padTemp: Math.max(110, Math.min(320, prev.rearRight.padTemp + (tempIncrease * 0.8) + (Math.random() - 0.5) * 6)),
              discTemp: Math.max(130, Math.min(370, prev.rearRight.discTemp + (tempIncrease * 0.8) + (Math.random() - 0.5) * 8))
            }
          };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [disabled, vehicleData?.speed]);

  const getAirflowStatus = (value, min, max) => {
    if (value < min * 0.8) return { status: 'low', color: 'text-red-400', icon: TrendingDown };
    if (value > max * 0.9) return { status: 'high', color: 'text-orange-400', icon: TrendingUp };
    return { status: 'normal', color: 'text-green-400', icon: Activity };
  };

  const getPressureStatus = (pressure) => {
    if (pressure < 35) return { status: 'low', color: 'text-red-400', icon: TrendingDown };
    if (pressure > 55) return { status: 'high', color: 'text-orange-400', icon: TrendingUp };
    return { status: 'optimal', color: 'text-green-400', icon: Activity };
  };

  const getBrakeTemp = (temp) => {
    if (temp > 300) return { status: 'critical', color: 'text-red-400', bgColor: 'bg-red-900/30', border: 'border-red-500' };
    if (temp > 250) return { status: 'high', color: 'text-orange-400', bgColor: 'bg-orange-900/30', border: 'border-orange-500' };
    if (temp > 200) return { status: 'warm', color: 'text-yellow-400', bgColor: 'bg-yellow-900/30', border: 'border-yellow-500' };
    return { status: 'normal', color: 'text-green-400', bgColor: 'bg-green-900/30', border: 'border-green-500' };
  };

  const airflowStatus = getAirflowStatus(airflowData.intake, 100, 180);
  const pressureStatus = getPressureStatus(compressorData.outputPressure);

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema de Monitoreo */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-green-400" />
              <h3 className="text-xl font-semibold text-green-400">
                Monitoreo de Parámetros en Tiempo Real
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-400 border-green-400">
                <Activity className="w-3 h-3 mr-1" />
                MONITOREANDO
              </Badge>
            </div>
          </div>
          
          {/* Resumen de Estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Flujo de Aire</div>
              <div className={`text-xl font-bold ${airflowStatus.color}`}>
                {airflowData.intake.toFixed(1)} L/min
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Presión Compresor</div>
              <div className={`text-xl font-bold ${pressureStatus.color}`}>
                {compressorData.outputPressure.toFixed(1)} PSI
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Temp. Frenos Max</div>
              <div className="text-xl font-bold text-orange-400">
                {Math.max(
                  brakeData.frontLeft.discTemp,
                  brakeData.frontRight.discTemp,
                  brakeData.rearLeft.discTemp,
                  brakeData.rearRight.discTemp
                ).toFixed(0)}°C
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoreo de Flujo de Aire */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center">
            <Wind className="w-5 h-5 mr-2" />
            Flujo de Aire - Sistema de Ventilación
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Aire de Entrada */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-cyan-400" />
                  <span className="font-semibold text-white">Entrada al Ducto</span>
                </div>
                <Badge variant="outline" className={airflowStatus.color}>
                  {airflowData.intake.toFixed(1)} L/min
                </Badge>
              </div>
              
              <Progress value={(airflowData.intake / 200) * 100} className="h-3" />
              
              <div className="flex justify-between text-xs text-slate-500">
                <span>0 L/min</span>
                <span className="text-green-400">100-180 L/min (óptimo)</span>
                <span>200 L/min</span>
              </div>
            </div>

            {/* Aire de Salida */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wind className="w-5 h-5 text-blue-400 rotate-180" />
                  <span className="font-semibold text-white">Salida del Ducto</span>
                </div>
                <Badge variant="outline" className="text-blue-400">
                  {airflowData.exhaust.toFixed(1)} L/min
                </Badge>
              </div>
              
              <Progress value={(airflowData.exhaust / 200) * 100} className="h-3" />
              
              <div className="text-xs text-slate-500 text-center">
                Eficiencia: {((airflowData.exhaust / airflowData.intake) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Eficiencia de Filtros */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-purple-400" />
                  <span className="font-semibold text-white">Filtros Ultrafinos</span>
                </div>
                <Badge variant="outline" className="text-purple-400">
                  {airflowData.filterEfficiency.toFixed(1)}%
                </Badge>
              </div>
              
              <Progress value={airflowData.filterEfficiency} className="h-3" />
              
              <div className="text-xs text-slate-500 text-center">
                {airflowData.filterEfficiency > 90 ? '✅ Excelente' : 
                 airflowData.filterEfficiency > 85 ? '⚠️ Buena' : '🔴 Requiere mantenimiento'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoreo del Compresor */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-purple-400 mb-6 flex items-center">
            <Gauge className="w-5 h-5 mr-2" />
            Sistema de Compresor
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Presión de Salida */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Gauge className={`w-5 h-5 ${pressureStatus.color}`} />
                <span className="text-xs text-slate-400">PRESIÓN</span>
              </div>
              <div className={`text-xl font-bold ${pressureStatus.color}`}>
                {compressorData.outputPressure.toFixed(1)}
              </div>
              <div className="text-xs text-slate-500">PSI de salida</div>
              <Progress 
                value={(compressorData.outputPressure / 70) * 100} 
                className="h-2 mt-2" 
              />
            </div>

            {/* RPM del Motor */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-xs text-slate-400">RPM</span>
              </div>
              <div className="text-xl font-bold text-yellow-400">
                {compressorData.motorRPM.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">Revoluciones/min</div>
              <Progress 
                value={(compressorData.motorRPM / 4000) * 100} 
                className="h-2 mt-2" 
              />
            </div>

            {/* Temperatura */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                <span className="text-xs text-slate-400">TEMP</span>
              </div>
              <div className="text-xl font-bold text-orange-400">
                {compressorData.temperature.toFixed(1)}°C
              </div>
              <div className="text-xs text-slate-500">Motor compresor</div>
              <Progress 
                value={(compressorData.temperature / 100) * 100} 
                className="h-2 mt-2" 
              />
            </div>

            {/* Eficiencia */}
            <div className="p-4 bg-slate-800/50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <Activity className="w-5 h-5 text-green-400" />
                <span className="text-xs text-slate-400">EFICIENCIA</span>
              </div>
              <div className="text-xl font-bold text-green-400">
                {compressorData.efficiency.toFixed(1)}%
              </div>
              <div className="text-xs text-slate-500">Rendimiento</div>
              <Progress 
                value={compressorData.efficiency} 
                className="h-2 mt-2" 
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Monitoreo de Temperatura de Frenos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-red-400 mb-6 flex items-center">
            <Disc className="w-5 h-5 mr-2" />
            Temperatura de Frenos
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Frenos Delanteros */}
            <div className="space-y-4">
              <h5 className="font-semibold text-orange-400">Frenos Delanteros</h5>
              
              {['frontLeft', 'frontRight'].map((brake, index) => {
                const side = brake === 'frontLeft' ? 'Izquierdo' : 'Derecho';
                const padStatus = getBrakeTemp(brakeData[brake].padTemp);
                const discStatus = getBrakeTemp(brakeData[brake].discTemp);
                
                return (
                  <div key={brake} className={`p-4 rounded-lg border ${discStatus.border} ${discStatus.bgColor}`}>
                    <div className="text-sm font-semibold text-white mb-3">{side}</div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Pastillas</span>
                          <span className={`text-sm font-bold ${padStatus.color}`}>
                            {brakeData[brake].padTemp.toFixed(0)}°C
                          </span>
                        </div>
                        <Progress 
                          value={(brakeData[brake].padTemp / 350) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Discos</span>
                          <span className={`text-sm font-bold ${discStatus.color}`}>
                            {brakeData[brake].discTemp.toFixed(0)}°C
                          </span>
                        </div>
                        <Progress 
                          value={(brakeData[brake].discTemp / 400) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                    
                    {(brakeData[brake].padTemp > 250 || brakeData[brake].discTemp > 300) && (
                      <div className="flex items-center mt-2 text-xs text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Temperatura elevada
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Frenos Traseros */}
            <div className="space-y-4">
              <h5 className="font-semibold text-orange-400">Frenos Traseros</h5>
              
              {['rearLeft', 'rearRight'].map((brake, index) => {
                const side = brake === 'rearLeft' ? 'Izquierdo' : 'Derecho';
                const padStatus = getBrakeTemp(brakeData[brake].padTemp);
                const discStatus = getBrakeTemp(brakeData[brake].discTemp);
                
                return (
                  <div key={brake} className={`p-4 rounded-lg border ${discStatus.border} ${discStatus.bgColor}`}>
                    <div className="text-sm font-semibold text-white mb-3">{side}</div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Pastillas</span>
                          <span className={`text-sm font-bold ${padStatus.color}`}>
                            {brakeData[brake].padTemp.toFixed(0)}°C
                          </span>
                        </div>
                        <Progress 
                          value={(brakeData[brake].padTemp / 350) * 100} 
                          className="h-2" 
                        />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-300">Discos</span>
                          <span className={`text-sm font-bold ${discStatus.color}`}>
                            {brakeData[brake].discTemp.toFixed(0)}°C
                          </span>
                        </div>
                        <Progress 
                          value={(brakeData[brake].discTemp / 400) * 100} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                    
                    {(brakeData[brake].padTemp > 250 || brakeData[brake].discTemp > 300) && (
                      <div className="flex items-center mt-2 text-xs text-red-400">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Temperatura elevada
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ParameterMonitoringSystem;