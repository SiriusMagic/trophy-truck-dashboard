import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Radar, Target, Activity, Mountain } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SituationalAwareness = ({ vehicleData, disabled }) => {
  const [thermalVision, setThermalVision] = useState(false);
  const [nightVision, setNightVision] = useState(false);
  const [lidarActive, setLidarActive] = useState(true);
  const [proximityAlerts, setProximityAlerts] = useState(true);
  const [sentinelMode, setSentinelMode] = useState(false);
  const [detectedObjects, setDetectedObjects] = useState([]);
  const { toast } = useToast();

  // Simulate object detection
  useEffect(() => {
    if (!disabled && (thermalVision || nightVision || lidarActive)) {
      const interval = setInterval(() => {
        const mockObjects = [
          { type: 'Rock', distance: 15.5, temperature: 22, threat: 'Low' },
          { type: 'Tree', distance: 8.2, temperature: 18, threat: 'Medium' },
          { type: 'Animal', distance: 45.3, temperature: 37, threat: 'Low' },
          { type: 'Vehicle', distance: 125.7, temperature: 45, threat: 'None' }
        ];
        
        setDetectedObjects(mockObjects.filter(() => Math.random() > 0.6));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [thermalVision, nightVision, lidarActive, disabled]);

  const handleSentinelToggle = () => {
    setSentinelMode(!sentinelMode);
    if (!sentinelMode) {
      setLidarActive(true);
      setProximityAlerts(true);
      toast({
        title: "🛡️ Modo Sentinel activado",
        description: "Vigilancia perimetral iniciada",
      });
    } else {
      toast({
        title: "Modo Sentinel desactivado",
        description: "Vigilancia perimetral detenida",
      });
    }
  };

  const getThreatColor = (threat) => {
    switch (threat) {
      case 'High': return 'text-red-400';
      case 'Medium': return 'text-orange-400';
      case 'Low': return 'text-yellow-400';
      default: return 'text-green-400';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Vision Controls */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-green-400">
              Sistema de Visión Avanzada
            </h3>
            <Badge variant={sentinelMode ? "destructive" : "outline-solid"}>
              {sentinelMode ? "🛡️ SENTINEL ACTIVO" : "MODO NORMAL"}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visión Térmica</span>
                <Switch 
                  checked={thermalVision} 
                  onCheckedChange={setThermalVision}
                  disabled={disabled}
                />
              </div>
              <div className="text-xs text-slate-500">Detecta fuentes de calor</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Visión Nocturna</span>
                <Switch 
                  checked={nightVision} 
                  onCheckedChange={setNightVision}
                  disabled={disabled}
                />
              </div>
              <div className="text-xs text-slate-500">Amplificación de luz</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">LIDAR 3D</span>
                <Switch 
                  checked={lidarActive} 
                  onCheckedChange={setLidarActive}
                  disabled={disabled}
                />
              </div>
              <div className="text-xs text-slate-500">Mapeo topográfico</div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Alertas</span>
                <Switch 
                  checked={proximityAlerts} 
                  onCheckedChange={setProximityAlerts}
                  disabled={disabled}
                />
              </div>
              <div className="text-xs text-slate-500">Proximidad peligrosa</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sentinel Mode Control */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-400">
              Modo Sentinel - Vigilancia Perimetral
            </h3>
            <Button
              variant={sentinelMode ? "destructive" : "outline-solid"}
              onClick={handleSentinelToggle}
              disabled={disabled}
              className="font-bold"
            >
              {sentinelMode ? "DESACTIVAR SENTINEL" : "ACTIVAR SENTINEL"}
            </Button>
          </div>
          
          <div className="text-sm text-slate-400 mb-4">
            El modo Sentinel mantiene los sensores activos mientras el vehículo está apagado, 
            detectando movimiento y actividad sospechosa en un radio de 50 metros.
          </div>
          
          {sentinelMode && (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">ACTIVO</div>
                <div className="text-xs text-slate-500">Estado del sistema</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-400">47m</div>
                <div className="text-xs text-slate-500">Radio de detección</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-400">12h</div>
                <div className="text-xs text-slate-500">Batería restante</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Real-time Detection Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Object Detection */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-purple-400">
                Objetos Detectados
              </h3>
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            
            <div className="space-y-3">
              {detectedObjects.length === 0 ? (
                <div className="text-center text-slate-500 py-8">
                  <Radar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <div>No se detectan objetos</div>
                </div>
              ) : (
                detectedObjects.map((obj, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div>
                      <div className="font-semibold text-sm">{obj.type}</div>
                      <div className="text-xs text-slate-400">{obj.distance}m</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className={getThreatColor(obj.threat)}>
                        {obj.threat}
                      </Badge>
                      {thermalVision && (
                        <div className="text-xs text-orange-400 mt-1">
                          {obj.temperature}°C
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Topographic Display */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-cyan-400">
                Mapa Topográfico 3D
              </h3>
              <Mountain className="w-6 h-6 text-cyan-400" />
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-800/50 h-32 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Activity className="w-8 h-8 mx-auto mb-2 text-cyan-400" />
                  <div className="text-sm text-slate-400">Vista 3D del terreno</div>
                  <div className="text-xs text-slate-500">LIDAR escaneando...</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-400">Inclinación adelante:</div>
                  <div className="text-cyan-400 font-bold">{vehicleData.pitch?.toFixed(1)}°</div>
                </div>
                <div>
                  <div className="text-slate-400">Inclinación lateral:</div>
                  <div className="text-cyan-400 font-bold">{vehicleData.roll?.toFixed(1)}°</div>
                </div>
                <div>
                  <div className="text-slate-400">Altimetría:</div>
                  <div className="text-cyan-400 font-bold">1,247m</div>
                </div>
                <div>
                  <div className="text-slate-400">Pendiente:</div>
                  <div className="text-cyan-400 font-bold">12.3%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Attitude Monitor */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-4">
            Monitor de Constantes Vitales del Chasis
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Presión FL</div>
              <div className="text-xl font-bold text-yellow-400">
                {vehicleData.tirePressure?.fl?.toFixed(1)} PSI
              </div>
              <Progress value={vehicleData.tirePressure?.fl * 2.5} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Presión FR</div>
              <div className="text-xl font-bold text-yellow-400">
                {vehicleData.tirePressure?.fr?.toFixed(1)} PSI
              </div>
              <Progress value={vehicleData.tirePressure?.fr * 2.5} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Presión RL</div>
              <div className="text-xl font-bold text-yellow-400">
                {vehicleData.tirePressure?.rl?.toFixed(1)} PSI
              </div>
              <Progress value={vehicleData.tirePressure?.rl * 2.5} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-2">Presión RR</div>
              <div className="text-xl font-bold text-yellow-400">
                {vehicleData.tirePressure?.rr?.toFixed(1)} PSI
              </div>
              <Progress value={vehicleData.tirePressure?.rr * 2.5} className="h-2 mt-2" />
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-slate-400">G-Force Lateral</div>
              <div className="text-lg font-bold text-purple-400">
                {vehicleData.gForce?.x?.toFixed(2)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">G-Force Longitudinal</div>
              <div className="text-lg font-bold text-purple-400">
                {vehicleData.gForce?.y?.toFixed(2)}g
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400">G-Force Vertical</div>
              <div className="text-lg font-bold text-purple-400">
                {vehicleData.gForce?.z?.toFixed(2)}g
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SituationalAwareness;