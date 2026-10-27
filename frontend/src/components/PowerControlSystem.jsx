import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Brain, Target, ArrowLeftRight, Cpu } from 'lucide-react';

const PowerControlSystem = ({ 
  powerControlMode, 
  setPowerControlMode, 
  powerDistribution, 
  setPowerDistribution,
  motorControls,
  setMotorControls,
  individualMotorControls,
  setIndividualMotorControls,
  aiPowerActive,
  setAiPowerActive,
  disabled 
}) => {

  const handlePowerDistributionChange = (values) => {
    const rear = values[0];
    const front = 100 - rear;
    setPowerDistribution([rear, front]);
  };

  const handleMotorControlChange = (motor, type, value) => {
    setMotorControls(prev => ({
      ...prev,
      [motor]: {
        ...prev[motor],
        [type]: value[0]
      }
    }));
  };

  const handleIndividualMotorChange = (motor, type, value) => {
    setIndividualMotorControls(prev => ({
      ...prev,
      [motor]: {
        ...prev[motor],
        [type]: value[0]
      }
    }));
  };

  const getTotalPower = () => {
    if (powerControlMode === 'individual') {
      return Object.values(individualMotorControls).reduce((total, motor) => 
        total + (motor.voltage * motor.amperage / 1000), 0
      );
    }
    return (motorControls.rear.voltage * motorControls.rear.amperage + 
            motorControls.front.voltage * motorControls.front.amperage) / 1000;
  };

  return (
    <div className="space-y-6">
      
      {/* Power Control Mode Selection */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-yellow-400">
              Sistema de Control de Potencia Tri-Modal
            </h3>
            <Badge className="bg-yellow-600 text-lg px-4 py-2">
              MODO: {powerControlMode.toUpperCase()}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Button
              variant={powerControlMode === 'axle' ? "default" : "outline-solid"}
              onClick={() => setPowerControlMode('axle')}
              disabled={disabled}
              className={`h-20 flex flex-col ${
                powerControlMode === 'axle' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'border-slate-600 hover:border-yellow-400'
              }`}
            >
              <ArrowLeftRight className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">POR EJES</span>
              <span className="text-xs text-slate-300">Delantero/Trasero</span>
            </Button>
            
            <Button
              variant={powerControlMode === 'individual' ? "default" : "outline-solid"}
              onClick={() => setPowerControlMode('individual')}
              disabled={disabled}
              className={`h-20 flex flex-col ${
                powerControlMode === 'individual' 
                  ? 'bg-yellow-600 hover:bg-yellow-700' 
                  : 'border-slate-600 hover:border-yellow-400'
              }`}
            >
              <Target className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">INDIVIDUAL</span>
              <span className="text-xs text-slate-300">Cada motor</span>
            </Button>
            
            <Button
              variant={powerControlMode === 'ai' ? "default" : "outline-solid"}
              onClick={() => setPowerControlMode('ai')}
              disabled={disabled}
              className={`h-20 flex flex-col ${
                powerControlMode === 'ai' 
                  ? 'bg-purple-600 hover:bg-purple-700' 
                  : 'border-slate-600 hover:border-purple-400'
              }`}
            >
              <Brain className="w-8 h-8 mb-2" />
              <span className="text-sm font-bold">IA INTELIGENTE</span>
              <span className="text-xs text-slate-300">Automático</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Power Control Interface */}
      {powerControlMode === 'axle' && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-cyan-400 mb-6">
              Control de Potencia por Ejes
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Eje Trasero</span>
                  <span className="text-cyan-400 font-bold">{powerDistribution[0]}%</span>
                </div>
                <Slider
                  value={[powerDistribution[0]]}
                  onValueChange={handlePowerDistributionChange}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={disabled}
                />
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Eje Delantero</span>
                  <span className="text-cyan-400 font-bold">{powerDistribution[1]}%</span>
                </div>
                <Progress value={powerDistribution[1]} className="h-4" />
              </div>
            </div>

            {/* Axle Motor Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {/* Rear Axle */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-red-400 font-semibold mb-4">Motor Eje Trasero</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Voltaje</span>
                        <span className="text-red-400 font-bold">{motorControls.rear.voltage}V</span>
                      </div>
                      <Slider
                        value={[motorControls.rear.voltage]}
                        onValueChange={(value) => handleMotorControlChange('rear', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Amperaje</span>
                        <span className="text-red-400 font-bold">{motorControls.rear.amperage}A</span>
                      </div>
                      <Slider
                        value={[motorControls.rear.amperage]}
                        onValueChange={(value) => handleMotorControlChange('rear', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Front Axle */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-blue-400 font-semibold mb-4">Motor Eje Delantero</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Voltaje</span>
                        <span className="text-blue-400 font-bold">{motorControls.front.voltage}V</span>
                      </div>
                      <Slider
                        value={[motorControls.front.voltage]}
                        onValueChange={(value) => handleMotorControlChange('front', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-300">Amperaje</span>
                        <span className="text-blue-400 font-bold">{motorControls.front.amperage}A</span>
                      </div>
                      <Slider
                        value={[motorControls.front.amperage]}
                        onValueChange={(value) => handleMotorControlChange('front', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {powerControlMode === 'individual' && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-orange-400 mb-6">
              Control Individual de Motores
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Rear Left Motor */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-red-400 font-semibold mb-3 text-sm">Motor Trasero Izq.</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Voltaje</span>
                        <span className="text-red-400 text-sm font-bold">{individualMotorControls.rearLeft.voltage}V</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.rearLeft.voltage]}
                        onValueChange={(value) => handleIndividualMotorChange('rearLeft', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Amperaje</span>
                        <span className="text-red-400 text-sm font-bold">{individualMotorControls.rearLeft.amperage}A</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.rearLeft.amperage]}
                        onValueChange={(value) => handleIndividualMotorChange('rearLeft', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rear Right Motor */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-red-400 font-semibold mb-3 text-sm">Motor Trasero Der.</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Voltaje</span>
                        <span className="text-red-400 text-sm font-bold">{individualMotorControls.rearRight.voltage}V</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.rearRight.voltage]}
                        onValueChange={(value) => handleIndividualMotorChange('rearRight', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Amperaje</span>
                        <span className="text-red-400 text-sm font-bold">{individualMotorControls.rearRight.amperage}A</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.rearRight.amperage]}
                        onValueChange={(value) => handleIndividualMotorChange('rearRight', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Front Left Motor */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-blue-400 font-semibold mb-3 text-sm">Motor Delantero Izq.</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Voltaje</span>
                        <span className="text-blue-400 text-sm font-bold">{individualMotorControls.frontLeft.voltage}V</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.frontLeft.voltage]}
                        onValueChange={(value) => handleIndividualMotorChange('frontLeft', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Amperaje</span>
                        <span className="text-blue-400 text-sm font-bold">{individualMotorControls.frontLeft.amperage}A</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.frontLeft.amperage]}
                        onValueChange={(value) => handleIndividualMotorChange('frontLeft', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Front Right Motor */}
              <Card className="bg-slate-800/50 border-slate-600">
                <CardContent className="p-4">
                  <h4 className="text-blue-400 font-semibold mb-3 text-sm">Motor Delantero Der.</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Voltaje</span>
                        <span className="text-blue-400 text-sm font-bold">{individualMotorControls.frontRight.voltage}V</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.frontRight.voltage]}
                        onValueChange={(value) => handleIndividualMotorChange('frontRight', 'voltage', value)}
                        min={200}
                        max={600}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-300">Amperaje</span>
                        <span className="text-blue-400 text-sm font-bold">{individualMotorControls.frontRight.amperage}A</span>
                      </div>
                      <Slider
                        value={[individualMotorControls.frontRight.amperage]}
                        onValueChange={(value) => handleIndividualMotorChange('frontRight', 'amperage', value)}
                        min={50}
                        max={300}
                        step={5}
                        className="w-full"
                        disabled={disabled}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      )}

      {powerControlMode === 'ai' && (
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-purple-400">
                Sistema de Potencia Inteligente con IA
              </h3>
              <Button
                variant={aiPowerActive ? "destructive" : "default"}
                onClick={setAiPowerActive}
                disabled={disabled}
                className={`font-bold ${aiPowerActive ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
              >
                <Brain className="w-5 h-5 mr-2" />
                {aiPowerActive ? 'IA ACTIVA' : 'ACTIVAR IA'}
              </Button>
            </div>
            
            {aiPowerActive ? (
              <div className="space-y-6">
                <div className="bg-slate-800/50 p-6 rounded-lg">
                  <h4 className="text-purple-300 font-semibold mb-4 flex items-center">
                    <Cpu className="w-5 h-5 mr-2" />
                    Estado de la IA
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-400 mb-1">OPTIMIZANDO</div>
                      <div className="text-sm text-slate-400">Estado del sistema</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-1">450+ Nm</div>
                      <div className="text-sm text-slate-400">Torque IA</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-400 mb-1">95%</div>
                      <div className="text-sm text-slate-400">Eficiencia</div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardContent className="p-4">
                      <h5 className="text-purple-300 font-semibold mb-3">Parámetros IA</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Análisis terreno:</span>
                          <span className="text-purple-400">ACTIVO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Predicción tracción:</span>
                          <span className="text-purple-400">ACTIVO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Optimización batería:</span>
                          <span className="text-purple-400">ACTIVO</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Modelo neuronal:</span>
                          <span className="text-purple-400">GPT-DRIVE-v2</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-slate-800/50 border-slate-600">
                    <CardContent className="p-4">
                      <h5 className="text-purple-300 font-semibold mb-3">Decisiones en Tiempo Real</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Dist. potencia:</span>
                          <span className="text-purple-400">70% T / 30% D</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Voltaje trasero:</span>
                          <span className="text-purple-400">520V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Voltaje delantero:</span>
                          <span className="text-purple-400">480V</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Predicción:</span>
                          <span className="text-purple-400">+15% rendimiento</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                <div className="text-slate-400 mb-4">
                  La IA analizará el terreno, patrones de conducción y optimizará 
                  automáticamente la distribución de potencia en tiempo real.
                </div>
                <div className="text-sm text-slate-500">
                  Haz click en "ACTIVAR IA" para comenzar la optimización inteligente.
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Power Summary */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-green-400 mb-4">
            Resumen de Potencia Total
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">
                {getTotalPower().toFixed(1)} kW
              </div>
              <div className="text-sm text-slate-400">Potencia Total</div>
              <Progress value={getTotalPower() * 10} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">
                {powerControlMode === 'ai' ? '450+' : Math.round(getTotalPower() * 1.2)} Nm
              </div>
              <div className="text-sm text-slate-400">Torque Estimado</div>
              <Progress value={(getTotalPower() * 1.2) / 6} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">
                {powerControlMode === 'individual' ? '4' : '2'}
              </div>
              <div className="text-sm text-slate-400">Motores Activos</div>
              <Progress value={powerControlMode === 'individual' ? 100 : 50} className="h-2 mt-2" />
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">
                {powerControlMode === 'ai' ? '95' : '87'}%
              </div>
              <div className="text-sm text-slate-400">Eficiencia</div>
              <Progress value={powerControlMode === 'ai' ? 95 : 87} className="h-2 mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PowerControlSystem;