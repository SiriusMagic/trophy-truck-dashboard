import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { RotateCcw, Zap, Gauge } from 'lucide-react';
import { virtualGears } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const VirtualTransmission = ({ currentGear, setCurrentGear, motorControls, setMotorControls, disabled }) => {
  const { toast } = useToast();

  // Fallbacks para evitar crashes si el padre no provee props
  const defaultControls = { rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } };
  const mc = motorControls ?? defaultControls;
  const setMC = setMotorControls ?? (() => {});

  const handleGearChange = (newGear) => {
    if (newGear === currentGear) return;
    if (!setCurrentGear) return;
    setCurrentGear(newGear);
    const gearConfig = virtualGears.find(g => g.gear === newGear);
    if (gearConfig && setMC) {
      setMC(gearConfig.defaultSettings);
      toast({
        title: `Marcha ${newGear > 0 ? newGear : 'R'} engranada`,
        description: gearConfig.description,
      });
    }
  };

  const getCurrentGearConfig = () => {
    return virtualGears.find(g => g.gear === currentGear) || virtualGears[1];
  };

  const handleMotorControlChange = (motor, type, value) => {
    const gearConfig = getCurrentGearConfig();
    const range = type === 'voltage' ? gearConfig.voltageRange : gearConfig.amperageRange;
    const clampedValue = Math.max(range[0], Math.min(range[1], value[0]));
    if (!setMC) return;
    setMC(prev => ({
      ...(prev ?? defaultControls),
      [motor]: {
        ...((prev ?? defaultControls)[motor]),
        [type]: clampedValue
      }
    }));
  };

  const resetToDefault = () => {
    const gearConfig = getCurrentGearConfig();
    if (setMC) setMC(gearConfig.defaultSettings);
    toast({
      title: "Configuración restaurada",
      description: `Valores por defecto para marcha ${currentGear > 0 ? currentGear : 'R'}`,
    });
  };

  const gearConfig = getCurrentGearConfig();

  return (
    <div className="space-y-6">
      {/* Gear Selection */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-purple-400">
              Transmisión Virtual - Control de Par y Velocidad
            </h3>
            <Badge className="bg-purple-600 text-lg px-4 py-2">
              MARCHA: {currentGear > 0 ? currentGear : 'R'}
            </Badge>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button
              variant={currentGear === -1 ? "destructive" : "outline-solid"}
              onClick={() => handleGearChange(-1)}
              disabled={disabled}
              className="h-16 text-lg font-bold"
            >
              <RotateCcw className="w-6 h-6 mb-2" />
              R
            </Button>
            {[1, 2, 3].map((gear) => (
              <Button
                key={gear}
                variant={currentGear === gear ? "default" : "outline-solid"}
                onClick={() => handleGearChange(gear)}
                disabled={disabled}
                className={`h-16 text-lg font-bold ${
                  currentGear === gear 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-slate-600 hover:border-purple-400'
                }`}
              >
                <span className="text-2xl mb-1">{gear}</span>
              </Button>
            ))}
          </div>
          <div className="bg-slate-800/50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-300 mb-2">{gearConfig.name}</h4>
            <p className="text-sm text-slate-400">{gearConfig.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Motor Control within Gear Limits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rear Motor */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-red-400">
                Motor Trasero - Marcha {currentGear > 0 ? currentGear : 'R'}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefault}
                disabled={disabled}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Voltaje</span>
                  <span className="text-red-400 font-bold">{mc.rear.voltage}V</span>
                </div>
                <Slider
                  value={[mc.rear.voltage]}
                  onValueChange={(value) => handleMotorControlChange('rear', 'voltage', value)}
                  min={gearConfig.voltageRange[0]}
                  max={gearConfig.voltageRange[1]}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Min: {gearConfig.voltageRange[0]}V</span>
                  <span>Max: {gearConfig.voltageRange[1]}V</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Amperaje</span>
                  <span className="text-red-400 font-bold">{mc.rear.amperage}A</span>
                </div>
                <Slider
                  value={[mc.rear.amperage]}
                  onValueChange={(value) => handleMotorControlChange('rear', 'amperage', value)}
                  min={gearConfig.amperageRange[0]}
                  max={gearConfig.amperageRange[1]}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Min: {gearConfig.amperageRange[0]}A</span>
                  <span>Max: {gearConfig.amperageRange[1]}A</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <Gauge className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs text-slate-400">Velocidad Est.</div>
                  <div className="text-sm font-bold text-blue-400">
                    {Math.round(mc.rear.voltage * 0.25)} km/h
                  </div>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                  <div className="text-xs text-slate-400">Torque Est.</div>
                  <div className="text-sm font-bold text-yellow-400">
                    {Math.round(mc.rear.amperage * 1.2)} Nm
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Front Motor */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-blue-400">
                Motor Delantero - Marcha {currentGear > 0 ? currentGear : 'R'}
              </h3>
              <Badge variant="outline" className="text-blue-400">
                SECUNDARIO
              </Badge>
            </div>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Voltaje</span>
                  <span className="text-blue-400 font-bold">{mc.front.voltage}V</span>
                </div>
                <Slider
                  value={[mc.front.voltage]}
                  onValueChange={(value) => handleMotorControlChange('front', 'voltage', value)}
                  min={gearConfig.voltageRange[0]}
                  max={gearConfig.voltageRange[1]}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Min: {gearConfig.voltageRange[0]}V</span>
                  <span>Max: {gearConfig.voltageRange[1]}V</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-300">Amperaje</span>
                  <span className="text-blue-400 font-bold">{mc.front.amperage}A</span>
                </div>
                <Slider
                  value={[mc.front.amperage]}
                  onValueChange={(value) => handleMotorControlChange('front', 'amperage', value)}
                  min={gearConfig.amperageRange[0]}
                  max={gearConfig.amperageRange[1]}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>Min: {gearConfig.amperageRange[0]}A</span>
                  <span>Max: {gearConfig.amperageRange[1]}A</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 p-3 bg-slate-800/50 rounded-lg">
                <div className="text-center">
                  <Gauge className="w-5 h-5 mx-auto mb-1 text-blue-400" />
                  <div className="text-xs text-slate-400">Velocidad Est.</div>
                  <div className="text-sm font-bold text-blue-400">
                    {Math.round(mc.front.voltage * 0.25)} km/h
                  </div>
                </div>
                <div className="text-center">
                  <Zap className="w-5 h-5 mx-auto mb-1 text-yellow-400" />
                  <div className="text-xs text-slate-400">Torque Est.</div>
                  <div className="text-sm font-bold text-yellow-400">
                    {Math.round(mc.front.amperage * 1.2)} Nm
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gear Performance Stats */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Rendimiento Combinado - Marcha {currentGear > 0 ? currentGear : 'R'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {Math.round((mc.rear.voltage + mc.front.voltage) / 2)} V
              </div>
              <div className="text-sm text-slate-400">Voltaje Promedio</div>
              <Progress 
                value={((mc.rear.voltage + mc.front.voltage) / 2) / 6} 
                className="h-2 mt-2" 
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {Math.round(mc.rear.amperage + mc.front.amperage)} A
              </div>
              <div className="text-sm text-slate-400">Amperaje Total</div>
              <Progress 
                value={(mc.rear.amperage + mc.front.amperage) / 6} 
                className="h-2 mt-2" 
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {Math.round(((mc.rear.voltage + mc.front.voltage) / 2) * 0.25)} km/h
              </div>
              <div className="text-sm text-slate-400">Velocidad Máxima Est.</div>
              <Progress 
                value={((mc.rear.voltage + mc.front.voltage) / 2) * 0.25 / 2} 
                className="h-2 mt-2" 
              />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">
                {Math.round((mc.rear.amperage + mc.front.amperage) * 1.2)} Nm
              </div>
              <div className="text-sm text-slate-400">Torque Total Est.</div>
              <Progress 
                value={(mc.rear.amperage + mc.front.amperage) * 1.2 / 6} 
                className="h-2 mt-2" 
              />
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-800/50 rounded-lg">
            <div className="text-center text-sm text-slate-400">
              <strong>Recomendación para Marcha {currentGear > 0 ? currentGear : 'R'}:</strong>
              <br />
              {currentGear === 1 && "Ideal para arranque, subidas pronunciadas y maniobras de precisión"}
              {currentGear === 2 && "Perfecto para conducción off-road general y terreno mixto"}
              {currentGear === 3 && "Óptimo para alta velocidad en terrenos planos y dunas"}
              {currentGear === -1 && "Máximo torque en reversa para salir de situaciones difíciles"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VirtualTransmission;