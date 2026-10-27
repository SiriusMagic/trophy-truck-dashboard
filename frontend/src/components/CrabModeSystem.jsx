import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { 
  Navigation, 
  RotateCw, 
  ArrowRight,
  ArrowLeft, 
  Gauge, 
  Car,
  Compass,
  Target,
  Move,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CrabModeSystem = ({ vehicleData, disabled }) => {
  // -- Variables principales del sistema Modo Cangrejo --
  
  /** 
   * Variable booleana para activar el modo cangrejo
   * Cuando es true: activa la funcionalidad de movimiento lateral
   * Cuando es false: comportamiento normal de dirección
   */
  const [modoCangrejoActivo, setModoCangrejoActivo] = useState(false);
  
  /** 
   * Ángulo de las ruedas traseras en grados
   * Rango: -10 a +10 grados para movimiento lateral
   * Positivo: giro hacia la derecha, Negativo: giro hacia la izquierda
   */
  const [anguloRuedasTraseras, setAnguloRuedasTraseras] = useState(0);
  
  /** 
   * Ángulo de las ruedas delanteras en grados
   * En modo cangrejo: siempre 0 (ruedas rectas)
   * En modo normal: controlado por el volante
   */
  const [anguloRuedasDelanteras, setAnguloRuedasDelanteras] = useState(0);
  
  // Variables adicionales para la simulación avanzada
  const [velocidadVehiculo, setVelocidadVehiculo] = useState(0); // km/h
  const [estadoDireccion, setEstadoDireccion] = useState('Línea recta');
  const [intensidadMovimiento, setIntensidadMovimiento] = useState([0]); // Control deslizante 0-100%
  const [direccionMovimiento, setDireccionMovimiento] = useState('neutral'); // 'left', 'right', 'neutral'
  
  const { toast } = useToast();

  // Simular velocidad del vehículo basada en datos reales
  useEffect(() => {
    if (vehicleData?.speed !== undefined) {
      setVelocidadVehiculo(vehicleData.speed);
    } else {
      // Simulación de velocidad si no hay datos reales
      setVelocidadVehiculo(Math.random() * 80);
    }
  }, [vehicleData?.speed]);

  /** 
   * LÓGICA PRINCIPAL DEL MODO CANGREJO
   * Esta lógica determina el comportamiento de las ruedas según la velocidad
   */
  useEffect(() => {
    if (modoCangrejoActivo) {
      // En modo cangrejo: las ruedas delanteras SIEMPRE están a 0 grados
      setAnguloRuedasDelanteras(0);
      
      // Calcular ángulo de ruedas traseras basado en la intensidad del control
      const anguloMaximo = 10; // Máximo 10 grados
      const factorIntensidad = intensidadMovimiento[0] / 100; // Convertir porcentaje a factor 0-1
      
      let anguloCalculado = 0;
      
      if (direccionMovimiento === 'right') {
        anguloCalculado = anguloMaximo * factorIntensidad;
      } else if (direccionMovimiento === 'left') {
        anguloCalculado = -anguloMaximo * factorIntensidad;
      }
      
      setAnguloRuedasTraseras(anguloCalculado);
      
      // Determinar estado de dirección basado en velocidad y ángulo
      if (anguloCalculado === 0) {
        setEstadoDireccion('Línea recta - Modo Cangrejo');
      } else if (velocidadVehiculo < 50) {
        // A BAJA VELOCIDAD: movimiento lateral puro (cangrejo verdadero)
        setEstadoDireccion(`Baja velocidad - Movimiento lateral ${Math.abs(anguloCalculado).toFixed(1)}°`);
      } else {
        // A ALTA VELOCIDAD: las ruedas traseras apoyan el giro para mayor estabilidad
        setEstadoDireccion(`Alta velocidad - Giro asistido ${Math.abs(anguloCalculado).toFixed(1)}°`);
      }
    } else {
      // Modo normal: las ruedas traseras están a 0 grados
      setAnguloRuedasTraseras(0);
      setEstadoDireccion('Modo normal - Dirección convencional');
      
      // En modo normal, simular ángulo de ruedas delanteras
      setAnguloRuedasDelanteras(Math.sin(Date.now() / 1000) * 15); // Simulación de movimiento del volante
    }
  }, [modoCangrejoActivo, intensidadMovimiento, direccionMovimiento, velocidadVehiculo]);

  /**
   * Función para activar/desactivar el modo cangrejo
   */
  const toggleModoCangrejo = () => {
    const nuevoEstado = !modoCangrejoActivo;
    setModoCangrejoActivo(nuevoEstado);
    
    if (nuevoEstado) {
      // Al activar: resetear controles
      setIntensidadMovimiento([0]);
      setDireccionMovimiento('neutral');
      toast({
        title: "🦀 Modo Cangrejo Activado",
        description: "Movimiento lateral habilitado - Use los controles con precaución",
      });
    } else {
      // Al desactivar: resetear todo
      setIntensidadMovimiento([0]);
      setDireccionMovimiento('neutral');
      toast({
        title: "Modo Cangrejo Desactivado",
        description: "Volviendo a dirección convencional",
      });
    }
  };

  /**
   * Función para controlar la dirección del movimiento lateral
   */
  const setDireccionCangrejo = (direccion) => {
    if (modoCangrejoActivo) {
      setDireccionMovimiento(direccion);
      
      const direcciones = {
        'left': 'izquierda',
        'right': 'derecha',
        'neutral': 'centro'
      };
      
      toast({
        title: `Dirección: ${direcciones[direccion]}`,
        description: `Movimiento lateral hacia la ${direcciones[direccion]}`,
      });
    }
  };

  /**
   * Función para obtener el color del indicador según el ángulo
   */
  const getAngleColor = (angle) => {
    if (Math.abs(angle) === 0) return 'text-green-400';
    if (Math.abs(angle) <= 5) return 'text-yellow-400';
    return 'text-orange-400';
  };

  /**
   * Función para obtener el estado visual del modo
   */
  const getModoEstado = () => {
    if (!modoCangrejoActivo) return { color: 'text-slate-400', icon: Car, status: 'NORMAL' };
    if (anguloRuedasTraseras === 0) return { color: 'text-blue-400', icon: Target, status: 'CANGREJO - CENTRO' };
    return { color: 'text-orange-400', icon: ArrowUpRight, status: 'CANGREJO - ACTIVO' };
  };

  const estadoModo = getModoEstado();
  const IconEstado = estadoModo.icon;

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema Modo Cangrejo */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Move className="w-8 h-8 text-orange-400" />
              <h3 className="text-xl font-semibold text-orange-400">
                Sistema de Modo Cangrejo
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={modoCangrejoActivo ? "destructive" : "outline-solid"}>
                <IconEstado className="w-3 h-3 mr-1" />
                {estadoModo.status}
              </Badge>
              <Badge variant="outline" className="text-blue-400">
                {velocidadVehiculo.toFixed(0)} KM/H
              </Badge>
            </div>
          </div>
          
          {/* Descripción del sistema */}
          <div className="p-4 bg-slate-800/30 rounded-lg mb-4">
            <h4 className="text-sm font-semibold text-cyan-400 mb-2">¿Qué es el Modo Cangrejo?</h4>
            <p className="text-xs text-slate-300">
              El Modo Cangrejo permite movimiento lateral del vehículo manteniendo las ruedas delanteras rectas 
              y girando solo las traseras. Ideal para estacionamiento en paralelo y maniobras en espacios reducidos.
            </p>
          </div>
          
          {/* Estado actual del sistema */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Ruedas Delanteras</div>
              <div className={`text-xl font-bold ${getAngleColor(anguloRuedasDelanteras)}`}>
                {anguloRuedasDelanteras.toFixed(1)}°
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Ruedas Traseras</div>
              <div className={`text-xl font-bold ${getAngleColor(anguloRuedasTraseras)}`}>
                {anguloRuedasTraseras.toFixed(1)}°
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Velocidad</div>
              <div className="text-xl font-bold text-cyan-400">
                {velocidadVehiculo.toFixed(0)} km/h
              </div>
            </div>
            <div className="p-3 bg-slate-800/30 rounded-lg">
              <div className="text-slate-400 text-sm">Intensidad</div>
              <div className="text-xl font-bold text-purple-400">
                {intensidadMovimiento[0]}%
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Control Principal del Modo Cangrejo */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6">Control Principal</h4>
          
          <div className="space-y-6">
            
            {/* Activación del Modo */}
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center space-x-3">
                <Move className="w-6 h-6 text-orange-400" />
                <div>
                  <div className="font-semibold text-white">Activar Modo Cangrejo</div>
                  <div className="text-xs text-slate-400">
                    {modoCangrejoActivo ? 
                      'Movimiento lateral habilitado' : 
                      'Habilitar dirección de ruedas traseras para movimiento lateral'
                    }
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={modoCangrejoActivo}
                  onCheckedChange={toggleModoCangrejo}
                  disabled={disabled}
                />
                {modoCangrejoActivo && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    ACTIVO
                  </Badge>
                )}
              </div>
            </div>

            {/* Controles de Dirección - Solo visible cuando está activo */}
            {modoCangrejoActivo && (
              <div className="space-y-4">
                
                {/* Botones de dirección */}
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    variant={direccionMovimiento === 'left' ? "default" : "outline-solid"}
                    onClick={() => setDireccionCangrejo('left')}
                    disabled={disabled}
                    className="flex flex-col h-16 space-y-1"
                  >
                    <ArrowLeft className="w-6 h-6" />
                    <span className="text-xs">Izquierda</span>
                  </Button>
                  
                  <Button
                    variant={direccionMovimiento === 'neutral' ? "default" : "outline-solid"}
                    onClick={() => setDireccionCangrejo('neutral')}
                    disabled={disabled}
                    className="flex flex-col h-16 space-y-1"
                  >
                    <Target className="w-6 h-6" />
                    <span className="text-xs">Centro</span>
                  </Button>
                  
                  <Button
                    variant={direccionMovimiento === 'right' ? "default" : "outline-solid"}
                    onClick={() => setDireccionCangrejo('right')}
                    disabled={disabled}
                    className="flex flex-col h-16 space-y-1"
                  >
                    <ArrowRight className="w-6 h-6" />
                    <span className="text-xs">Derecha</span>
                  </Button>
                </div>

                {/* Control de intensidad */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Gauge className="w-5 h-5 text-purple-400" />
                      <span className="font-semibold text-white">Intensidad de Movimiento</span>
                    </div>
                    <Badge variant="outline" className="text-purple-400">
                      {intensidadMovimiento[0]}%
                    </Badge>
                  </div>
                  
                  <Slider
                    value={intensidadMovimiento}
                    onValueChange={setIntensidadMovimiento}
                    min={0}
                    max={100}
                    step={5}
                    className="w-full"
                    disabled={disabled || direccionMovimiento === 'neutral'}
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0% (Sin movimiento)</span>
                    <span>50% (Moderado)</span>
                    <span>100% (Máximo)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Visualización de Estado de Dirección */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center">
            <Compass className="w-5 h-5 mr-2" />
            Estado Actual de la Dirección
          </h4>
          
          {/* Estado descriptivo */}
          <div className="text-center p-4 bg-slate-800/30 rounded-lg mb-6">
            <div className={`text-lg font-semibold ${estadoModo.color}`}>
              {estadoDireccion}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {modoCangrejoActivo ? 
                (velocidadVehiculo < 50 ? 
                  'A baja velocidad: movimiento lateral puro para estacionamiento' :
                  'A alta velocidad: giro asistido para mayor estabilidad'
                ) :
                'Dirección convencional con solo ruedas delanteras'
              }
            </div>
          </div>
          
          {/* Visualización gráfica de ruedas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Ruedas Delanteras */}
            <div className="space-y-4">
              <h5 className="font-semibold text-cyan-400 text-center">Ruedas Delanteras</h5>
              
              <div className="relative bg-slate-800/50 rounded-lg h-32 flex items-center justify-center">
                <div 
                  className="w-8 h-16 bg-cyan-400 rounded transform transition-transform duration-300"
                  style={{ transform: `rotate(${anguloRuedasDelanteras}deg)` }}
                />
                <div className="absolute top-2 left-2 text-xs text-cyan-400">
                  {anguloRuedasDelanteras.toFixed(1)}°
                </div>
                {modoCangrejoActivo && (
                  <div className="absolute top-2 right-2 text-xs text-green-400">
                    FIJAS (0°)
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className={getAngleColor(anguloRuedasDelanteras)}>
                  {modoCangrejoActivo ? 'Posición Fija' : 'Control Normal'}
                </Badge>
              </div>
            </div>

            {/* Ruedas Traseras */}
            <div className="space-y-4">
              <h5 className="font-semibold text-orange-400 text-center">Ruedas Traseras</h5>
              
              <div className="relative bg-slate-800/50 rounded-lg h-32 flex items-center justify-center">
                <div 
                  className={`w-8 h-16 rounded transform transition-transform duration-300 ${
                    modoCangrejoActivo ? 'bg-orange-400' : 'bg-slate-600'
                  }`}
                  style={{ transform: `rotate(${anguloRuedasTraseras}deg)` }}
                />
                <div className={`absolute top-2 left-2 text-xs ${
                  modoCangrejoActivo ? 'text-orange-400' : 'text-slate-500'
                }`}>
                  {anguloRuedasTraseras.toFixed(1)}°
                </div>
                {modoCangrejoActivo && anguloRuedasTraseras !== 0 && (
                  <div className="absolute top-2 right-2 text-xs text-red-400 animate-pulse">
                    MOVIMIENTO
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className={
                  modoCangrejoActivo ? 
                    (anguloRuedasTraseras === 0 ? 'text-blue-400' : 'text-orange-400') : 
                    'text-slate-500'
                }>
                  {modoCangrejoActivo ? 
                    (anguloRuedasTraseras === 0 ? 'Centradas' : 'Movimiento Lateral') : 
                    'Inactivas'
                  }
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicadores de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Velocidad Actual */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Gauge className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="text-xl font-bold text-cyan-400">
              {velocidadVehiculo.toFixed(0)} km/h
            </div>
            <div className="text-xs text-slate-400">Velocidad Actual</div>
            <div className="text-xs text-slate-500 mt-1">
              {velocidadVehiculo < 50 ? '🐌 Baja velocidad' : '🏃 Alta velocidad'}
            </div>
          </CardContent>
        </Card>
        
        {/* Estado del Modo */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <IconEstado className={`w-6 h-6 ${estadoModo.color}`} />
            </div>
            <div className={`text-lg font-bold ${estadoModo.color}`}>
              {modoCangrejoActivo ? 'ACTIVO' : 'INACTIVO'}
            </div>
            <div className="text-xs text-slate-400">Modo Cangrejo</div>
            <div className="text-xs text-slate-500 mt-1">
              {modoCangrejoActivo ? '🦀 Movimiento lateral' : '🚗 Dirección normal'}
            </div>
          </CardContent>
        </Card>
        
        {/* Ángulo Máximo */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <RotateCw className="w-6 h-6 text-orange-400" />
            </div>
            <div className="text-xl font-bold text-orange-400">
              {Math.abs(anguloRuedasTraseras).toFixed(1)}°
            </div>
            <div className="text-xs text-slate-400">Ángulo Trasero</div>
            <div className="text-xs text-slate-500 mt-1">
              {anguloRuedasTraseras === 0 ? '➡️ Centro' : 
               anguloRuedasTraseras > 0 ? '↗️ Derecha' : '↖️ Izquierda'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información de Seguridad */}
      {modoCangrejoActivo && (
        <Card className="bg-yellow-900/20 border-yellow-500/50 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Precauciones de Seguridad
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Use el modo cangrejo solo a velocidades bajas (&lt;20 km/h)</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>Ideal para estacionamiento en paralelo y espacios reducidos</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <span>Evite giros bruscos o cambios rápidos de dirección</span>
                </div>
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  <span>Mantenga velocidad constante durante la maniobra</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CrabModeSystem;