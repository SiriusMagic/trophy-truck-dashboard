import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Input } from './ui/input';
import { 
  MapPin, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Navigation, 
  Car,
  Target,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const GeocercasSystem = () => {
  // Estado principal
  const [ubicacionVehiculo, setUbicacionVehiculo] = useState({ lat: 0, lon: 0 });
  const [geocerca, setGeocerca] = useState({ lat: 10, lon: 10, radio: 350 });
  const [estadoGeocerca, setEstadoGeocerca] = useState(null);
  const [simulacionActiva, setSimulacionActiva] = useState(false);
  const [distanciaCalculada, setDistanciaCalculada] = useState(0);
  const [modoSeguridad, setModoSeguridad] = useState(false);
  const [alertaEnviada, setAlertaEnviada] = useState(false);

  // Función simple para calcular distancia aproximada entre dos puntos
  const calcularDistancia = (punto1, punto2) => {
    const deltaLat = punto2.lat - punto1.lat;
    const deltaLon = punto2.lon - punto1.lon;
    
    // Fórmula simple de distancia euclidiana (no geográficamente precisa pero funcional)
    const distancia = Math.sqrt(deltaLat * deltaLat + deltaLon * deltaLon) * 111; // Aproximación en km
    return Math.round(distancia * 1000); // Convertir a metros
  };

  // Función para verificar si el vehículo está dentro de la geocerca
  const verificarGeocerca = useCallback(() => {
    const distancia = calcularDistancia(ubicacionVehiculo, geocerca);
    setDistanciaCalculada(distancia);
    
    if (distancia <= geocerca.radio) {
      setEstadoGeocerca('dentro');
      setModoSeguridad(true);
      setAlertaEnviada(false);
    } else {
      setEstadoGeocerca('fuera');
      setModoSeguridad(false);
      setAlertaEnviada(true);
    }
  }, [ubicacionVehiculo, geocerca]);

  // Simulación automática de movimiento del vehículo
  useEffect(() => {
    let interval;
    
    if (simulacionActiva) {
      interval = setInterval(() => {
        setUbicacionVehiculo(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.002, // Movimiento aleatorio pequeño
          lon: prev.lon + (Math.random() - 0.5) * 0.002
        }));
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [simulacionActiva]);

  // Verificar geocerca automáticamente cuando cambie la ubicación
  useEffect(() => {
    if (simulacionActiva) {
      verificarGeocerca();
    }
  }, [ubicacionVehiculo, geocerca, simulacionActiva, verificarGeocerca]);

  const iniciarSimulacion = () => {
    setSimulacionActiva(true);
    verificarGeocerca();
  };

  const detenerSimulacion = () => {
    setSimulacionActiva(false);
  };

  const reiniciarSistema = () => {
    setSimulacionActiva(false);
    setUbicacionVehiculo({ lat: 0, lon: 0 });
    setGeocerca({ lat: 10, lon: 10, radio: 350 });
    setEstadoGeocerca(null);
    setModoSeguridad(false);
    setAlertaEnviada(false);
    setDistanciaCalculada(0);
  };

  const moverVehiculoDentro = () => {
    setUbicacionVehiculo({
      lat: geocerca.lat + 0.001, // Posición dentro del radio
      lon: geocerca.lon + 0.001
    });
  };

  const moverVehiculoFuera = () => {
    setUbicacionVehiculo({
      lat: geocerca.lat + 0.05, // Posición fuera del radio
      lon: geocerca.lon + 0.05
    });
  };

  // Calcular resultado basado en el estado actual
  const resultado = useMemo(() => {
    if (!estadoGeocerca) return null;
    
    if (estadoGeocerca === 'dentro') {
      return {
        estado: 'dentro',
        mensaje: 'El vehículo está DENTRO de la geocerca. Activando modo de seguridad.',
        color: 'text-green-400',
        accion: 'Modo Seguridad Activado'
      };
    } else {
      return {
        estado: 'fuera',
        mensaje: 'El vehículo está FUERA de la geocerca. Enviando alerta.',
        color: 'text-red-400',
        accion: 'Alerta Enviada'
      };
    }
  }, [estadoGeocerca]);

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <MapPin className="w-8 h-8 text-blue-400" />
          GEOCERCAS - Sistema de Perímetro Virtual
        </h2>
        <p className="text-gray-400">Monitoreo y Control de Zonas Geográficas</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de Control Principal */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-400">
              <Settings className="w-6 h-6" />
              Panel de Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Estado de Simulación */}
            <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full ${simulacionActiva ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="text-white font-semibold">
                  Simulación: {simulacionActiva ? 'ACTIVA' : 'DETENIDA'}
                </span>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={iniciarSimulacion} 
                  disabled={simulacionActiva}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
                <Button 
                  onClick={detenerSimulacion} 
                  disabled={!simulacionActiva}
                  size="sm"
                  variant="outline"
                >
                  <Pause className="w-4 h-4 mr-1" />
                  Detener
                </Button>
              </div>
            </div>

            {/* Controles Rápidos */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Controles Rápidos:</h4>
              <div className="flex gap-2">
                <Button 
                  onClick={moverVehiculoDentro} 
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Target className="w-4 h-4 mr-1" />
                  Mover Dentro
                </Button>
                <Button 
                  onClick={moverVehiculoFuera} 
                  size="sm"
                  className="bg-red-600 hover:bg-red-700"
                >
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  Mover Fuera
                </Button>
                <Button 
                  onClick={reiniciarSistema} 
                  size="sm"
                  variant="outline"
                >
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reiniciar
                </Button>
              </div>
            </div>

            {/* Configuración de Geocerca */}
            <div className="space-y-4">
              <h4 className="text-white font-semibold">Configuración de Geocerca:</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Latitud</label>
                  <Input 
                    type="number" 
                    value={geocerca.lat}
                    onChange={(e) => setGeocerca(prev => ({...prev, lat: parseFloat(e.target.value) || 0}))}
                    className="bg-slate-800 border-slate-600"
                    step="0.001"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Longitud</label>
                  <Input 
                    type="number" 
                    value={geocerca.lon}
                    onChange={(e) => setGeocerca(prev => ({...prev, lon: parseFloat(e.target.value) || 0}))}
                    className="bg-slate-800 border-slate-600"
                    step="0.001"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm text-gray-400">Radio (metros): {geocerca.radio}m</label>
                <Slider
                  value={[geocerca.radio]}
                  onValueChange={(value) => setGeocerca(prev => ({...prev, radio: value[0]}))}
                  min={50}
                  max={1000}
                  step={10}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Estado */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-400">
              <Navigation className="w-6 h-6" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ubicación del Vehículo */}
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Ubicación del Vehículo</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Latitud:</span>
                  <span className="text-white ml-2">{ubicacionVehiculo.lat.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Longitud:</span>
                  <span className="text-white ml-2">{ubicacionVehiculo.lon.toFixed(6)}</span>
                </div>
              </div>
            </div>

            {/* Estado de Geocerca */}
            <div className="p-4 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-orange-400" />
                <span className="text-white font-semibold">Centro de Geocerca</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <span className="text-gray-400">Latitud:</span>
                  <span className="text-white ml-2">{geocerca.lat.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-gray-400">Longitud:</span>
                  <span className="text-white ml-2">{geocerca.lon.toFixed(6)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">Radio:</span>
                <Badge variant="outline" className="text-orange-400 border-orange-400">
                  {geocerca.radio} metros
                </Badge>
              </div>
            </div>

            {/* Distancia Calculada */}
            {distanciaCalculada > 0 && (
              <div className="p-4 bg-slate-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Distancia al Centro:</span>
                  <span className="text-white font-bold">{distanciaCalculada} m</span>
                </div>
                <Progress 
                  value={(distanciaCalculada / geocerca.radio) * 100} 
                  className="mt-2 h-2"
                />
              </div>
            )}

            {/* Resultado del Análisis */}
            {resultado && (
              <div className={`p-4 rounded-lg border-2 ${
                resultado.estado === 'dentro' 
                  ? 'bg-green-900/30 border-green-500' 
                  : 'bg-red-900/30 border-red-500'
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {resultado.estado === 'dentro' ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  )}
                  <span className={`font-bold ${resultado.color}`}>
                    {resultado.estado === 'dentro' ? 'DENTRO DE GEOCERCA' : 'FUERA DE GEOCERCA'}
                  </span>
                </div>
                <p className={`${resultado.color} font-semibold mb-3`}>
                  {resultado.mensaje}
                </p>
                <Badge 
                  variant="outline" 
                  className={resultado.estado === 'dentro' ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}
                >
                  {resultado.accion}
                </Badge>
              </div>
            )}

            {/* Indicadores de Estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
                <Shield className={`w-5 h-5 ${modoSeguridad ? 'text-green-400' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm text-gray-400">Modo Seguridad</div>
                  <div className={`font-semibold ${modoSeguridad ? 'text-green-400' : 'text-gray-500'}`}>
                    {modoSeguridad ? 'ACTIVO' : 'INACTIVO'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg">
                <AlertTriangle className={`w-5 h-5 ${alertaEnviada ? 'text-red-400' : 'text-gray-500'}`} />
                <div>
                  <div className="text-sm text-gray-400">Sistema de Alerta</div>
                  <div className={`font-semibold ${alertaEnviada ? 'text-red-400' : 'text-gray-500'}`}>
                    {alertaEnviada ? 'ALERTA ACTIVA' : 'NORMAL'}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información Técnica */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-gray-400 text-lg">Información del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Algoritmo de Distancia:</div>
              <div className="text-white">Euclidiano Simplificado</div>
            </div>
            <div>
              <div className="text-gray-400">Precisión:</div>
              <div className="text-white">±10 metros (simulación)</div>
            </div>
            <div>
              <div className="text-gray-400">Frecuencia de Actualización:</div>
              <div className="text-white">2 segundos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeocercasSystem;