import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { 
  Wind, 
  Brain, 
  Settings, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUp, 
  ArrowDown,
  Gauge,
  Target,
  RotateCw,
  Zap
} from 'lucide-react';

const ComponenteAerodinamico = ({
  modoControl,
  titulo, 
  icono: Icon, 
  estado, 
  setEstado, 
  unidad = "%",
  descripcion 
}) => (
  <Card className="bg-slate-800/50 border-slate-600">
    <CardHeader className="pb-3">
      <CardTitle className="flex items-center gap-2 text-sm text-blue-400">
        <Icon className="w-4 h-4" />
        {titulo}
      </CardTitle>
      <p className="text-xs text-gray-500">{descripcion}</p>
    </CardHeader>
    <CardContent className="space-y-4">
      {modoControl === 'uniforme' ? (
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Control Uniforme</span>
            <Badge variant="outline" className="text-blue-400 border-blue-400">
              {estado.uniforme}{unidad}
            </Badge>
          </div>
          <Slider
            value={[estado.uniforme]}
            onValueChange={(value) => setEstado(prev => ({...prev, uniforme: value[0]}))}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Control Izquierdo */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Izquierdo
              </span>
              <Badge variant="outline" className="text-green-400 border-green-400">
                {estado.izquierdo}{unidad}
              </Badge>
            </div>
            <Slider
              value={[estado.izquierdo]}
              onValueChange={(value) => setEstado(prev => ({...prev, izquierdo: value[0]}))}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
          
          {/* Control Derecho */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                Derecho
              </span>
              <Badge variant="outline" className="text-orange-400 border-orange-400">
                {estado.derecho}{unidad}
              </Badge>
            </div>
            <Slider
              value={[estado.derecho]}
              onValueChange={(value) => setEstado(prev => ({...prev, derecho: value[0]}))}
              min={0}
              max={100}
              step={1}
              className="w-full"
            />
          </div>
        </div>
      )}
    </CardContent>
  </Card>
);

const AerodinamicaSystem = () => {
  // Estado principal
  const [aerodinamicaInteligente, setAerodinamicaInteligente] = useState(true);
  const [modoControl, setModoControl] = useState('uniforme'); // 'uniforme' | 'independiente'
  
  // Estados para componentes aerodinámicos
  const [splitterDelantero, setSplitterDelantero] = useState({
    uniforme: 50,
    izquierdo: 45,
    derecho: 55
  });
  
  const [canards, setCanards] = useState({
    uniforme: 30,
    izquierdo: 25,
    derecho: 35
  });
  
  const [difusorTrasero, setDifusorTrasero] = useState({
    uniforme: 70,
    izquierdo: 68,
    derecho: 72
  });
  
  const [aleron, setAleron] = useState({
    uniforme: 60,
    izquierdo: 58,
    derecho: 62
  });

  // Estados de rendimiento calculados
  const [rendimientoAero, setRendimientoAero] = useState({
    downforce: 85,
    drag: 32,
    balance: 52,
    eficiencia: 78
  });

  // Simulación automática cuando está en modo inteligente
  useEffect(() => {
    let interval;
    
    if (aerodinamicaInteligente) {
      interval = setInterval(() => {
        // Simular ajustes automáticos basados en "condiciones"
        const velocidad = 85 + Math.random() * 30; // Velocidad simulada
        const factor = velocidad / 100;
        
        setSplitterDelantero(prev => ({
          ...prev,
          uniforme: Math.max(20, Math.min(80, 40 + factor * 20))
        }));
        
        setCanards(prev => ({
          ...prev,
          uniforme: Math.max(10, Math.min(60, 25 + factor * 15))
        }));
        
        setDifusorTrasero(prev => ({
          ...prev,
          uniforme: Math.max(50, Math.min(90, 60 + factor * 25))
        }));
        
        setAleron(prev => ({
          ...prev,
          uniforme: Math.max(40, Math.min(80, 50 + factor * 20))
        }));
        
        // Actualizar métricas de rendimiento
        setRendimientoAero({
          downforce: Math.max(60, Math.min(100, 75 + Math.random() * 20)),
          drag: Math.max(20, Math.min(50, 25 + Math.random() * 15)),
          balance: Math.max(40, Math.min(60, 45 + Math.random() * 10)),
          eficiencia: Math.max(70, Math.min(95, 80 + Math.random() * 10))
        });
      }, 2000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [aerodinamicaInteligente]);

  const toggleAerodinamicaInteligente = () => {
    setAerodinamicaInteligente(!aerodinamicaInteligente);
  };

  const resetearConfiguracion = () => {
    setSplitterDelantero({ uniforme: 50, izquierdo: 45, derecho: 55 });
    setCanards({ uniforme: 30, izquierdo: 25, derecho: 35 });
    setDifusorTrasero({ uniforme: 70, izquierdo: 68, derecho: 72 });
    setAleron({ uniforme: 60, izquierdo: 58, derecho: 62 });
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Wind className="w-8 h-8 text-blue-400" />
          AERODINÁMICA - Control de Flujo de Aire
        </h2>
        <p className="text-gray-400">Optimización Automática y Manual de Componentes Aerodinámicos</p>
      </div>

      {/* Control Principal */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Control Maestro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 bg-slate-800 rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className={`w-6 h-6 ${aerodinamicaInteligente ? 'text-green-400' : 'text-gray-400'}`} />
              <div>
                <div className="font-semibold text-white">Aerodinámica Inteligente</div>
                <div className="text-sm text-gray-400">
                  {aerodinamicaInteligente ? 'Ajustes automáticos activos' : 'Control manual habilitado'}
                </div>
              </div>
            </div>
            <Button
              onClick={toggleAerodinamicaInteligente}
              className={`px-6 py-2 font-semibold ${
                aerodinamicaInteligente 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {aerodinamicaInteligente ? 'ACTIVO' : 'DESACTIVADO'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Panel de Rendimiento */}
      <Card className="bg-slate-900/50 border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-400">
            <Gauge className="w-5 h-5" />
            Métricas de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{rendimientoAero.downforce}%</div>
              <div className="text-sm text-gray-400">Downforce</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-orange-400">{rendimientoAero.drag}%</div>
              <div className="text-sm text-gray-400">Drag</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">{rendimientoAero.balance}%</div>
              <div className="text-sm text-gray-400">Balance</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{rendimientoAero.eficiencia}%</div>
              <div className="text-sm text-gray-400">Eficiencia</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controles Manuales - Solo visible cuando aerodinámica inteligente está desactivada */}
      {!aerodinamicaInteligente && (
        <div className="space-y-6">
          {/* Selector de Modo de Control */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Settings className="w-5 h-5" />
                Modo de Control Manual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center justify-between">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="modoControl"
                      value="uniforme"
                      checked={modoControl === 'uniforme'}
                      onChange={(e) => setModoControl(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-white">Modo Uniforme (50-50)</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="modoControl"
                      value="independiente"
                      checked={modoControl === 'independiente'}
                      onChange={(e) => setModoControl(e.target.value)}
                      className="text-blue-600"
                    />
                    <span className="text-white">Modo Independiente</span>
                  </label>
                </div>
                
                <Button
                  onClick={resetearConfiguracion}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:bg-gray-700"
                >
                  <RotateCw className="w-4 h-4 mr-1" />
                  Resetear
                </Button>
              </div>
              
              <div className="mt-3 text-sm text-gray-400">
                {modoControl === 'uniforme' 
                  ? 'Un solo control ajusta ambos lados de manera uniforme'
                  : 'Controles separados para ajuste independiente izquierdo/derecho'
                }
              </div>
            </CardContent>
          </Card>

          {/* Componentes Aerodinámicos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComponenteAerodinamico
              modoControl={modoControl}
              titulo="Splitter Delantero"
              icono={ArrowDown}
              estado={splitterDelantero}
              setEstado={setSplitterDelantero}
              descripcion="Control de flujo de aire bajo el vehículo"
            />
            
            <ComponenteAerodinamico
              modoControl={modoControl}
              titulo="Canards / Dive Planes"
              icono={Zap}
              estado={canards}
              setEstado={setCanards}
              descripcion="Pequeñas superficies de control delanteras"
            />
            
            <ComponenteAerodinamico
              modoControl={modoControl}
              titulo="Difusor Trasero"
              icono={ArrowUp}
              estado={difusorTrasero}
              setEstado={setDifusorTrasero}
              descripcion="Acelera el aire bajo el vehículo"
            />
            
            <ComponenteAerodinamico
              modoControl={modoControl}
              titulo="Alerón / Spoiler"
              icono={Target}
              estado={aleron}
              setEstado={setAleron}
              descripcion="Superficie principal de generación de downforce"
            />
          </div>

          {/* Información de configuración actual */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-gray-400">Configuración Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400 mb-1">Splitter:</div>
                  <div className="text-white">
                    {modoControl === 'uniforme' 
                      ? `${splitterDelantero.uniforme}%` 
                      : `L:${splitterDelantero.izquierdo}% R:${splitterDelantero.derecho}%`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Canards:</div>
                  <div className="text-white">
                    {modoControl === 'uniforme' 
                      ? `${canards.uniforme}%` 
                      : `L:${canards.izquierdo}% R:${canards.derecho}%`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Difusor:</div>
                  <div className="text-white">
                    {modoControl === 'uniforme' 
                      ? `${difusorTrasero.uniforme}%` 
                      : `L:${difusorTrasero.izquierdo}% R:${difusorTrasero.derecho}%`
                    }
                  </div>
                </div>
                <div>
                  <div className="text-gray-400 mb-1">Alerón:</div>
                  <div className="text-white">
                    {modoControl === 'uniforme' 
                      ? `${aleron.uniforme}%` 
                      : `L:${aleron.izquierdo}% R:${aleron.derecho}%`
                    }
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AerodinamicaSystem;