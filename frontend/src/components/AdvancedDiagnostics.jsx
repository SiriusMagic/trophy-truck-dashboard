import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Activity, 
  Thermometer, 
  Battery,
  Zap,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdvancedDiagnostics = ({ vehicleData, motorControls, disabled }) => {
  const [diagnosticHistory, setDiagnosticHistory] = useState([]);
  const [activeAlerts, setActiveAlerts] = useState([]);
  const { toast } = useToast();

  // Fallback seguro para evitar errores cuando no se recibe motorControls
  const defaultControls = { rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } };
  const mc = motorControls ?? defaultControls;

  // Simulate diagnostic updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (!disabled) {
        // Add diagnostic entry
        const newEntry = {
          timestamp: new Date(),
          speed: vehicleData.speed,
          torque: vehicleData.torque,
          batteryTemp: vehicleData.batteryTemp,
          motorTemp: {
            front: vehicleData.motorHealth?.front?.temperature || 45,
            rear: vehicleData.motorHealth?.rear?.temperature || 48
          },
          powerPeak: mc.rear.voltage * mc.rear.amperage + 
                     mc.front.voltage * mc.front.amperage
        };

        setDiagnosticHistory(prev => 
          [newEntry, ...prev.slice(0, 19)] // Keep last 20 entries
        );

        // Check for alerts
        const alerts = [];
        if (vehicleData.batteryTemp > 45) {
          alerts.push({
            type: 'warning',
            message: 'Temperatura de batería elevada',
            value: `${vehicleData.batteryTemp.toFixed(1)}°C`
          });
        }
        if (motorControls.rear.voltage > 550) {
          alerts.push({
            type: 'info',
            message: 'Motor trasero en alta demanda',
            value: `${motorControls.rear.voltage}V`
          });
        }
        if (vehicleData.torque > 400) {
          alerts.push({
            type: 'warning',
            message: 'Torque máximo alcanzado',
            value: `${vehicleData.torque.toFixed(0)}Nm`
          });
        }

        setActiveAlerts(alerts);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [vehicleData, motorControls, disabled]);

  const getHealthColor = (value) => {
    if (value >= 95) return 'text-green-400';
    if (value >= 85) return 'text-yellow-400';
    if (value >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return <CheckCircle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* System Health Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Motor Health */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-blue-400">Salud de Motores</h3>
              <Cpu className="w-6 h-6 text-blue-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Motor Delantero</span>
                  <span className={`text-sm font-bold ${getHealthColor(vehicleData.motorHealth?.front?.efficiency || 94)}`}>
                    {vehicleData.motorHealth?.front?.efficiency || 94}%
                  </span>
                </div>
                <Progress value={vehicleData.motorHealth?.front?.efficiency || 94} className="h-2" />
                <div className="text-xs text-slate-500 mt-1">
                  Temp: {vehicleData.motorHealth?.front?.temperature || 45}°C | 
                  Rodamientos: {vehicleData.motorHealth?.front?.bearingHealth || 98}%
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Motor Trasero</span>
                  <span className={`text-sm font-bold ${getHealthColor(vehicleData.motorHealth?.rear?.efficiency || 96)}`}>
                    {vehicleData.motorHealth?.rear?.efficiency || 96}%
                  </span>
                </div>
                <Progress value={vehicleData.motorHealth?.rear?.efficiency || 96} className="h-2" />
                <div className="text-xs text-slate-500 mt-1">
                  Temp: {vehicleData.motorHealth?.rear?.temperature || 48}°C | 
                  Rodamientos: {vehicleData.motorHealth?.rear?.bearingHealth || 96}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Battery Pack Health */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-green-400">Paquete de Baterías</h3>
              <Battery className="w-6 h-6 text-green-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-slate-300">Salud General</span>
                  <span className={`text-sm font-bold ${getHealthColor(vehicleData.batteryPack?.health || 97)}`}>
                    {vehicleData.batteryPack?.health || 97}%
                  </span>
                </div>
                <Progress value={vehicleData.batteryPack?.health || 97} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-slate-400">Voltaje Total:</div>
                  <div className="text-green-400 font-bold">{vehicleData.batteryPack?.voltage || 402}V</div>
                </div>
                <div>
                  <div className="text-slate-400">Ciclos:</div>
                  <div className="text-green-400 font-bold">{vehicleData.batteryPack?.cycleCount || 1247}</div>
                </div>
              </div>
              
              <div>
                <div className="text-xs text-slate-400 mb-1">Temperaturas por Módulo:</div>
                <div className="grid grid-cols-4 gap-1">
                  {(vehicleData.batteryPack?.cellTemp || [31, 32, 32, 33]).map((temp, index) => (
                    <div key={index} className="text-center p-1 bg-slate-800/50 rounded text-xs">
                      <div className="text-orange-400">{temp}°C</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Alerts */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-yellow-400">Alertas del Sistema</h3>
              <Badge variant={activeAlerts.length > 0 ? "destructive" : "outline-solid"}>
                {activeAlerts.length} Activas
              </Badge>
            </div>
            
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {activeAlerts.length === 0 ? (
                <div className="text-center text-slate-500 py-4">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
                  <div className="text-sm">Todos los sistemas normales</div>
                </div>
              ) : (
                activeAlerts.map((alert, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-slate-800/50 rounded-lg">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1">
                      <div className="text-sm font-medium">{alert.message}</div>
                      <div className="text-xs text-slate-400">{alert.value}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Diagnostics Tabs */}
      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800">
          <TabsTrigger value="performance" className="data-[state=active]:bg-blue-600">
            <TrendingUp className="w-4 h-4 mr-2" />
            Rendimiento
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-green-600">
            <Clock className="w-4 h-4 mr-2" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="data-[state=active]:bg-orange-600">
            <HardDrive className="w-4 h-4 mr-2" />
            Mantenimiento
          </TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          {/* Real-time Performance Metrics */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-cyan-400 mb-4">
                Métricas de Rendimiento en Tiempo Real
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {((mc.rear.voltage * mc.rear.amperage + 
                       mc.front.voltage * mc.front.amperage) / 1000).toFixed(1)} kW
                  </div>
                  <div className="text-sm text-slate-400">Potencia Total</div>
                  <Progress 
                    value={((motorControls.rear.voltage * motorControls.rear.amperage + 
                             motorControls.front.voltage * motorControls.front.amperage) / 1000) / 2} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400 mb-1">
                    {((mc.rear.voltage * mc.rear.amperage + 
                       mc.front.voltage * mc.front.amperage) / 
                      vehicleData.batteryLevel * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-slate-400">Eficiencia</div>
                  <Progress 
                    value={((motorControls.rear.voltage * motorControls.rear.amperage + 
                             motorControls.front.voltage * motorControls.front.amperage) / 
                            vehicleData.batteryLevel * 100) / 2} 
                    className="h-2 mt-2" 
                  />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {vehicleData.batteryTemp.toFixed(1)}°C
                  </div>
                  <div className="text-sm text-slate-400">Temp. Batería</div>
                  <Progress value={vehicleData.batteryTemp * 2} className="h-2 mt-2" />
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {Math.round(vehicleData.batteryLevel * 4.2)} km
                  </div>
                  <div className="text-sm text-slate-400">Autonomía Est.</div>
                  <Progress value={vehicleData.batteryLevel} className="h-2 mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Performance History */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-green-400 mb-4">
                Historial de Esfuerzo del Vehículo
              </h3>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {diagnosticHistory.length === 0 ? (
                  <div className="text-center text-slate-500 py-8">
                    <Clock className="w-8 h-8 mx-auto mb-2" />
                    <div>Recopilando datos de historial...</div>
                  </div>
                ) : (
                  diagnosticHistory.map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-400">
                        {entry.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="flex space-x-4 text-xs">
                        <span className="text-cyan-400">
                          {entry.speed.toFixed(0)} km/h
                        </span>
                        <span className="text-yellow-400">
                          {entry.torque.toFixed(0)} Nm
                        </span>
                        <span className="text-orange-400">
                          {entry.batteryTemp.toFixed(1)}°C
                        </span>
                        <span className="text-purple-400">
                          {(entry.powerPeak / 1000).toFixed(1)} kW
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
          {/* Maintenance Schedule */}
          <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-orange-400 mb-4">
                Programa de Mantenimiento
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Refrigerante de motores</div>
                    <div className="text-xs text-slate-400">Próximo cambio en 2,500 km</div>
                  </div>
                  <Badge variant="outline" className="text-green-400">
                    OK
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Calibración de sensores</div>
                    <div className="text-xs text-slate-400">Recomendado cada 10,000 km</div>
                  </div>
                  <Badge variant="outline" className="text-yellow-400">
                    PRONTO
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Actualización de firmware</div>
                    <div className="text-xs text-slate-400">Versión disponible: v2.1.3</div>
                  </div>
                  <Badge variant="destructive">
                    DISPONIBLE
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div>
                    <div className="font-medium">Inspección de suspensión</div>
                    <div className="text-xs text-slate-400">Último: hace 1,200 km</div>
                  </div>
                  <Badge variant="outline" className="text-green-400">
                    OK
                  </Badge>
                </div>
              </div>
              
              <Button className="w-full mt-4 bg-orange-600 hover:bg-orange-700" disabled={disabled}>
                <HardDrive className="w-4 h-4 mr-2" />
                Programar Mantenimiento
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedDiagnostics;