import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  Battery,
  MapPin,
  TrendingUp,
  TrendingDown,
  Zap,
  Leaf,
  AlertTriangle,
  Target,
} from 'lucide-react';

const AutonomyControl = ({ vehicleData }) => {
  const [autonomyData, setAutonomyData] = useState({
    maxRange: 1000, // km por 100% batería
    currentRange: 0,
    efficiency: 4.2, // km por kWh
    consumptionRate: 15.8, // kWh/100km
    projectedRange: 0
  });

  const [drivingHistory] = useState([
    { time: '14:30', range: 825, efficiency: 4.5 },
    { time: '14:00', range: 845, efficiency: 4.3 },
    { time: '13:30', range: 878, efficiency: 4.1 },
    { time: '13:00', range: 901, efficiency: 4.4 }
  ]);

  // Calcular autonomía basada en batería actual
  useEffect(() => {
    const currentRange = Math.round((vehicleData.batteryLevel / 100) * autonomyData.maxRange);
    const projectedRange = Math.round(currentRange * (autonomyData.efficiency / 4.2)); // Ajuste por eficiencia
    
    setAutonomyData(prev => ({
      ...prev,
      currentRange,
      projectedRange,
      efficiency: 4.2 + (Math.random() - 0.5) * 0.6 // Simular variación
    }));
  }, [vehicleData.batteryLevel, autonomyData.maxRange]);

  const getRangeStatus = () => {
    if (autonomyData.currentRange > 600) return { text: 'Excelente', color: 'text-green-400', bg: 'bg-green-600' };
    if (autonomyData.currentRange > 300) return { text: 'Buena', color: 'text-yellow-400', bg: 'bg-yellow-600' };
    if (autonomyData.currentRange > 100) return { text: 'Moderada', color: 'text-orange-400', bg: 'bg-orange-600' };
    return { text: 'Crítica', color: 'text-red-400', bg: 'bg-red-600' };
  };

  const getEfficiencyTrend = () => {
    const lastEfficiency = drivingHistory[1]?.efficiency || 4.2;
    return autonomyData.efficiency > lastEfficiency ? 'up' : 'down';
  };

  const rangeStatus = getRangeStatus();
  const efficiencyTrend = getEfficiencyTrend();

  return (
    <div className="space-y-6">
      
      {/* Main Autonomy Display */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-5xl font-bold text-cyan-400 mb-2">
              {autonomyData.currentRange} km
            </div>
            <div className="text-lg text-slate-400 mb-4">
              Autonomía Disponible
            </div>
            <div className="flex justify-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Battery className="w-5 h-5 text-green-400" />
                <span className="text-green-400">{vehicleData.batteryLevel}% Batería</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-400">1000 km máximo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Range Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Current Status */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-green-400">Estado Actual</h4>
              <Badge className={rangeStatus.bg}>
                {rangeStatus.text}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <Progress value={vehicleData.batteryLevel} className="h-4 mb-2" />
                <div className="text-2xl font-bold text-green-400">
                  {vehicleData.batteryLevel}%
                </div>
                <div className="text-sm text-slate-400">Carga restante</div>
              </div>
              
              <div className="text-center">
                <div className="text-xl font-bold text-cyan-400">
                  {autonomyData.currentRange} km
                </div>
                <div className="text-sm text-slate-400">Alcance estimado</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Efficiency */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-yellow-400">Eficiencia</h4>
              {efficiencyTrend === 'up' ? 
                <TrendingUp className="w-6 h-6 text-green-400" /> :
                <TrendingDown className="w-6 h-6 text-red-400" />
              }
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {autonomyData.efficiency.toFixed(1)}
                </div>
                <div className="text-sm text-slate-400">km/kWh</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-orange-400">
                  {autonomyData.consumptionRate.toFixed(1)}
                </div>
                <div className="text-sm text-slate-400">kWh/100km</div>
              </div>
              
              <div className="text-xs text-slate-500 text-center">
                {efficiencyTrend === 'up' ? 
                  '📈 Eficiencia mejorando' : 
                  '📉 Revisar consumo'
                }
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projected Range */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-purple-400">Proyección</h4>
              <MapPin className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {autonomyData.projectedRange} km
                </div>
                <div className="text-sm text-slate-400">Alcance ajustado</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">
                  {Math.round((autonomyData.projectedRange / vehicleData.speed) * 60) || 0} min
                </div>
                <div className="text-sm text-slate-400">Tiempo a velocidad actual</div>
              </div>
              
              <div className="text-xs text-slate-500 text-center">
                Basado en eficiencia actual
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Range History */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6">
            Historial de Autonomía
          </h4>
          
          <div className="space-y-3">
            {drivingHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-slate-300">
                    {entry.time}
                  </div>
                  <div className="text-sm text-blue-400">
                    {entry.range} km
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-yellow-400">
                    {entry.efficiency} km/kWh
                  </div>
                  <div className="w-8 h-2 bg-slate-700 rounded">
                    <div 
                      className="h-full bg-blue-400 rounded"
                      style={{ width: `${(entry.range / autonomyData.maxRange) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Range Optimization Tips */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6">
            Optimización de Autonomía
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Eco Tips */}
            <div className="space-y-4">
              <h5 className="text-green-300 font-semibold flex items-center">
                <Leaf className="w-5 h-5 mr-2" />
                Consejos Eco
              </h5>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Mantén velocidad constante 60-80 km/h</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Usa regeneración agresiva en descensos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Precalienta batería antes del viaje</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-slate-300">Minimiza uso de calefacción/AC</span>
                </div>
              </div>
            </div>

            {/* Performance Impact */}
            <div className="space-y-4">
              <h5 className="text-orange-300 font-semibold flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Impacto en Autonomía
              </h5>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Modo Eco</span>
                  <span className="text-green-400 text-sm">+15% autonomía</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Modo Sport</span>
                  <span className="text-orange-400 text-sm">-20% autonomía</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Overdrive</span>
                  <span className="text-red-400 text-sm">-35% autonomía</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Sistema Criogénico</span>
                  <span className="text-blue-400 text-sm">+8% autonomía</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Low Range Alert */}
      {autonomyData.currentRange < 200 && (
        <Card className="bg-red-900/20 border-red-500/30 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h4 className="text-lg font-semibold text-red-400">
                  ⚠️ Autonomía Baja
                </h4>
                <p className="text-sm text-slate-300">
                  Considera buscar una estación de carga. Autonomía restante: {autonomyData.currentRange} km
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AutonomyControl;