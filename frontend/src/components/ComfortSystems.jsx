import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Car,
  Thermometer,
  Volume2,
  Wind,
  Sun,
  Cloud,
  Droplets,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Play,
  Pause,
  Settings,
  Minus,
  Plus,
  Moon,
  Eye,
  Vibrate,
  Car as CarSeat
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ComfortSystems = ({ vehicleData, disabled }) => {
  const [rainSensor, setRainSensor] = useState({ active: true, intensity: 0, autoWipers: true });
  const [thermalIsolation, setThermalIsolation] = useState({ active: false, level: 50 });
  const [soundIsolation, setSoundIsolation] = useState({ active: false, level: 65 });
  const [seats, setSeats] = useState({
    driver: {
      heating: 0, // 0-100%
      massage: { active: false, intensity: 50, pattern: 'wave' },
      position: 1, // 1-8 positions
      zeroGravity: false
    },
    passenger: {
      heating: 0,
      massage: { active: false, intensity: 50, pattern: 'pulse' },
      position: 1,
      zeroGravity: false
    }
  });
  const [sunroof, setSunroof] = useState({
    position: 0, // 0-100% open
    ventilation: false,
    blinds: 0, // 0-100% closed
    autoControl: true
  });
  const [windowTinting, setWindowTinting] = useState({
    frontLeft: 20,
    frontRight: 20,
    rearLeft: 30,
    rearRight: 30,
    rear: 40,
    windshield: 10
  });
  const { toast } = useToast();

  // Rain sensor simulation
  useEffect(() => {
    if (rainSensor.active) {
      const interval = setInterval(() => {
        const newIntensity = Math.max(0, Math.min(100, rainSensor.intensity + (Math.random() - 0.7) * 20));
        setRainSensor(prev => ({ ...prev, intensity: newIntensity }));
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [rainSensor.active]);

  // Auto sunroof control based on weather
  useEffect(() => {
    if (sunroof.autoControl) {
      if (rainSensor.intensity > 50) {
        setSunroof(prev => ({ ...prev, position: 0, blinds: 80 }));
      } else if (vehicleData.batteryTemp > 35) {
        setSunroof(prev => ({ ...prev, position: 30, ventilation: true }));
      }
    }
  }, [rainSensor.intensity, vehicleData.batteryTemp, sunroof.autoControl]);

  const handleSeatHeating = (seat, value) => {
    setSeats(prev => ({
      ...prev,
      [seat]: { ...prev[seat], heating: value[0] }
    }));
  };

  const handleMassageToggle = (seat) => {
    setSeats(prev => ({
      ...prev,
      [seat]: { 
        ...prev[seat], 
        massage: { ...prev[seat].massage, active: !prev[seat].massage.active }
      }
    }));

    const seatName = seat === 'driver' ? 'conductor' : 'acompañante';
    toast({
      title: `Masaje ${seats[seat].massage.active ? 'desactivado' : 'activado'}`,
      description: `Asiento de ${seatName}`,
    });
  };

  const handleSeatPosition = (seat, direction) => {
    setSeats(prev => {
      const currentPos = prev[seat].position;
      const newPos = direction === 'up' ? 
        Math.min(8, currentPos + 1) : 
        Math.max(1, currentPos - 1);
      
      return {
        ...prev,
        [seat]: { ...prev[seat], position: newPos }
      };
    });
  };

  const handleZeroGravity = (seat) => {
    setSeats(prev => ({
      ...prev,
      [seat]: { 
        ...prev[seat], 
        zeroGravity: !prev[seat].zeroGravity,
        position: !prev[seat].zeroGravity ? 6 : prev[seat].position // Zero gravity position
      }
    }));

    toast({
      title: `Gravedad Cero ${seats[seat].zeroGravity ? 'desactivada' : 'activada'}`,
      description: seats[seat].zeroGravity ? 'Posición normal' : 'Máximo confort activado',
    });
  };

  const getSeatPositionName = (position) => {
    const positions = [
      '', 'Erguida', 'Confort', 'Deportiva', 'Relajada', 
      'Reclinada', 'Gravedad Cero', 'Descanso', 'Máximo Recline'
    ];
    return positions[position] || 'Personalizada';
  };

  const getRainIntensity = () => {
    if (rainSensor.intensity < 20) return { text: 'Sin lluvia', color: 'text-green-400' };
    if (rainSensor.intensity < 50) return { text: 'Lluvia ligera', color: 'text-yellow-400' };
    if (rainSensor.intensity < 80) return { text: 'Lluvia moderada', color: 'text-orange-400' };
    return { text: 'Lluvia intensa', color: 'text-red-400' };
  };

  const rainStatus = getRainIntensity();

  return (
    <div className="space-y-6">
      
      {/* Environmental Systems */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-blue-400 mb-6">
            Sistemas Ambientales Inteligentes
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Rain Sensor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-blue-300 font-semibold flex items-center">
                  <Droplets className="w-5 h-5 mr-2" />
                  Sensor de Lluvia
                </h5>
                <Switch 
                  checked={rainSensor.active} 
                  onCheckedChange={(checked) => setRainSensor(prev => ({ ...prev, active: checked }))}
                  disabled={disabled}
                />
              </div>
              
              <div className="text-center">
                <div className={`text-2xl font-bold mb-2 ${rainStatus.color}`}>
                  {rainSensor.intensity.toFixed(0)}%
                </div>
                <div className="text-sm text-slate-400">{rainStatus.text}</div>
                <Progress value={rainSensor.intensity} className="h-2 mt-2" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                <span className="text-sm text-slate-300">Limpiaparabrisas Auto</span>
                <Switch
                  checked={rainSensor.autoWipers}
                  onCheckedChange={(checked) => setRainSensor(prev => ({ ...prev, autoWipers: checked }))}
                  disabled={disabled || !rainSensor.active}
                />
              </div>
            </div>

            {/* Thermal Isolation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-orange-300 font-semibold flex items-center">
                  <Thermometer className="w-5 h-5 mr-2" />
                  Aislamiento Térmico
                </h5>
                <Switch 
                  checked={thermalIsolation.active} 
                  onCheckedChange={(checked) => setThermalIsolation(prev => ({ ...prev, active: checked }))}
                  disabled={disabled}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Nivel de Aislamiento</span>
                  <span className="text-orange-400 font-bold">{thermalIsolation.level}%</span>
                </div>
                <Slider
                  value={[thermalIsolation.level]}
                  onValueChange={(value) => setThermalIsolation(prev => ({ ...prev, level: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled || !thermalIsolation.active}
                />
                <div className="text-xs text-slate-500">
                  Aislamiento inteligente de puertas y ventanas
                </div>
              </div>
            </div>

            {/* Sound Isolation */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h5 className="text-purple-300 font-semibold flex items-center">
                  <Volume2 className="w-5 h-5 mr-2" />
                  Aislamiento Acústico
                </h5>
                <Switch 
                  checked={soundIsolation.active} 
                  onCheckedChange={(checked) => setSoundIsolation(prev => ({ ...prev, active: checked }))}
                  disabled={disabled}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-300">Nivel de Silencio</span>
                  <span className="text-purple-400 font-bold">{soundIsolation.level}%</span>
                </div>
                <Slider
                  value={[soundIsolation.level]}
                  onValueChange={(value) => setSoundIsolation(prev => ({ ...prev, level: value[0] }))}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled || !soundIsolation.active}
                />
                <div className="text-xs text-slate-500">
                  Cancelación activa de ruido externo
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seat Control Systems */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Driver Seat */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-6 flex items-center">
              <CarSeat className="w-6 h-6 mr-2" />
              Asiento del Conductor
            </h4>
            
            <div className="space-y-6">
              
              {/* Heating */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-medium">Calefacción</span>
                  <span className="text-green-400 font-bold">{seats.driver.heating}%</span>
                </div>
                <Slider
                  value={[seats.driver.heating]}
                  onValueChange={(value) => handleSeatHeating('driver', value)}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                <div className="text-xs text-slate-500">
                  {seats.driver.heating === 0 ? 'Desactivado' :
                   seats.driver.heating < 40 ? 'Calor suave' :
                   seats.driver.heating < 70 ? 'Calor moderado' : 'Calor intenso'}
                </div>
              </div>

              {/* Position Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-medium">Posición</span>
                  <Badge variant="outline" className="text-green-400">
                    {seats.driver.position}/8
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeatPosition('driver', 'down')}
                    disabled={disabled || seats.driver.position === 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-center flex-1">
                    <div className="text-lg font-bold text-green-400">{getSeatPositionName(seats.driver.position)}</div>
                    <div className="text-xs text-slate-500">Posición {seats.driver.position}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeatPosition('driver', 'up')}
                    disabled={disabled || seats.driver.position === 8}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Massage System */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-300 font-medium">Sistema de Masaje</span>
                  <Button
                    variant={seats.driver.massage.active ? "destructive" : "outline-solid"}
                    size="sm"
                    onClick={() => handleMassageToggle('driver')}
                    disabled={disabled}
                  >
                    {seats.driver.massage.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
                
                {seats.driver.massage.active && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-300">Intensidad</span>
                      <span className="text-green-400 font-bold">{seats.driver.massage.intensity}%</span>
                    </div>
                    <Slider
                      value={[seats.driver.massage.intensity]}
                      onValueChange={(value) => setSeats(prev => ({
                        ...prev,
                        driver: { 
                          ...prev.driver, 
                          massage: { ...prev.driver.massage, intensity: value[0] }
                        }
                      }))}
                      max={100}
                      step={10}
                      className="w-full"
                      disabled={disabled}
                    />
                  </div>
                )}
              </div>

              {/* Zero Gravity */}
              <Button
                variant={seats.driver.zeroGravity ? "default" : "outline-solid"}
                onClick={() => handleZeroGravity('driver')}
                disabled={disabled}
                className={`w-full h-12 ${seats.driver.zeroGravity ? 'bg-green-600' : ''}`}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {seats.driver.zeroGravity ? 'GRAVEDAD CERO ACTIVA' : 'ACTIVAR GRAVEDAD CERO'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Passenger Seat (Similar structure) */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-blue-400 mb-6 flex items-center">
              <CarSeat className="w-6 h-6 mr-2" />
              Asiento del Acompañante
            </h4>
            
            <div className="space-y-6">
              
              {/* Heating */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 font-medium">Calefacción</span>
                  <span className="text-blue-400 font-bold">{seats.passenger.heating}%</span>
                </div>
                <Slider
                  value={[seats.passenger.heating]}
                  onValueChange={(value) => handleSeatHeating('passenger', value)}
                  max={100}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
              </div>

              {/* Position Control */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 font-medium">Posición</span>
                  <Badge variant="outline" className="text-blue-400">
                    {seats.passenger.position}/8
                  </Badge>
                </div>
                
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeatPosition('passenger', 'down')}
                    disabled={disabled || seats.passenger.position === 1}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  
                  <div className="text-center flex-1">
                    <div className="text-lg font-bold text-blue-400">{getSeatPositionName(seats.passenger.position)}</div>
                    <div className="text-xs text-slate-500">Posición {seats.passenger.position}</div>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeatPosition('passenger', 'up')}
                    disabled={disabled || seats.passenger.position === 8}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Massage System */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 font-medium">Sistema de Masaje</span>
                  <Button
                    variant={seats.passenger.massage.active ? "destructive" : "outline-solid"}
                    size="sm"
                    onClick={() => handleMassageToggle('passenger')}
                    disabled={disabled}
                  >
                    {seats.passenger.massage.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Zero Gravity */}
              <Button
                variant={seats.passenger.zeroGravity ? "default" : "outline-solid"}
                onClick={() => handleZeroGravity('passenger')}
                disabled={disabled}
                className={`w-full h-12 ${seats.passenger.zeroGravity ? 'bg-blue-600' : ''}`}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                {seats.passenger.zeroGravity ? 'GRAVEDAD CERO ACTIVA' : 'ACTIVAR GRAVEDAD CERO'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sunroof Control */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-yellow-400 mb-6">
            Control de Techo Corredizo Inteligente
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Sunroof Position */}
            <div className="space-y-4">
              <h5 className="text-yellow-300 font-semibold">Apertura del Techo</h5>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {sunroof.position}%
                </div>
                <div className="text-sm text-slate-400">
                  {sunroof.position === 0 ? 'Cerrado' :
                   sunroof.position < 50 ? 'Parcialmente abierto' : 'Completamente abierto'}
                </div>
              </div>
              
              <Slider
                value={[sunroof.position]}
                onValueChange={(value) => setSunroof(prev => ({ ...prev, position: value[0] }))}
                max={100}
                step={5}
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Blinds Control */}
            <div className="space-y-4">
              <h5 className="text-yellow-300 font-semibold">Persianas Solares</h5>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">
                  {sunroof.blinds}%
                </div>
                <div className="text-sm text-slate-400">
                  {sunroof.blinds === 0 ? 'Transparente' :
                   sunroof.blinds < 50 ? 'Semi-oscuro' : 'Protección total'}
                </div>
              </div>
              
              <Slider
                value={[sunroof.blinds]}
                onValueChange={(value) => setSunroof(prev => ({ ...prev, blinds: value[0] }))}
                max={100}
                step={5}
                className="w-full"
                disabled={disabled}
              />
            </div>

            {/* Ventilation & Auto */}
            <div className="space-y-4">
              <h5 className="text-yellow-300 font-semibold">Controles</h5>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">Ventilación</span>
                  <Switch
                    checked={sunroof.ventilation}
                    onCheckedChange={(checked) => setSunroof(prev => ({ ...prev, ventilation: checked }))}
                    disabled={disabled}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-sm text-slate-300">Control Auto</span>
                  <Switch
                    checked={sunroof.autoControl}
                    onCheckedChange={(checked) => setSunroof(prev => ({ ...prev, autoControl: checked }))}
                    disabled={disabled}
                  />
                </div>
                
                {sunroof.autoControl && (
                  <div className="text-xs text-slate-500 p-2 bg-slate-700/30 rounded">
                    Se ajusta automáticamente según lluvia y temperatura
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Window Tinting Control */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-indigo-400 mb-6">
            Control de Atenuación de Ventanas
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Object.entries(windowTinting).map(([window, tint]) => (
              <div key={window} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-indigo-300">
                    {window === 'frontLeft' ? 'Delantera Izq' :
                     window === 'frontRight' ? 'Delantera Der' :
                     window === 'rearLeft' ? 'Trasera Izq' :
                     window === 'rearRight' ? 'Trasera Der' :
                     window === 'rear' ? 'Luneta Trasera' : 'Parabrisas'}
                  </span>
                  <span className="text-indigo-400 font-bold">{tint}%</span>
                </div>
                
                <Slider
                  value={[tint]}
                  onValueChange={(value) => setWindowTinting(prev => ({ ...prev, [window]: value[0] }))}
                  max={90}
                  step={5}
                  className="w-full"
                  disabled={disabled}
                />
                
                <div className="text-xs text-slate-500 text-center">
                  {tint < 30 ? 'Transparente' :
                   tint < 60 ? 'Semi-oscuro' : 'Privacidad'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 flex justify-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setWindowTinting({
                frontLeft: 10, frontRight: 10, rearLeft: 10, 
                rearRight: 10, rear: 10, windshield: 5
              })}
              disabled={disabled}
              className="text-sm"
            >
              <Sun className="w-4 h-4 mr-2" />
              Todo Transparente
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setWindowTinting({
                frontLeft: 70, frontRight: 70, rearLeft: 80, 
                rearRight: 80, rear: 85, windshield: 15
              })}
              disabled={disabled}
              className="text-sm"
            >
              <Moon className="w-4 h-4 mr-2" />
              Máxima Privacidad
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ComfortSystems;