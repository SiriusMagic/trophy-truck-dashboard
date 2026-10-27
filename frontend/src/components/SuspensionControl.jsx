import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { suspensionModes } from '../data/mockData';
import { useToast } from '../hooks/use-toast';

const SuspensionControl = ({ disabled }) => {
  const [height, setHeight] = useState([50]); // 0-100%
  const [stiffness, setStiffness] = useState({
    front: [60],
    rear: [65]
  });
  const [activeMode, setActiveMode] = useState('Manual');
  const [autoAdjust, setAutoAdjust] = useState(false);
  const { toast } = useToast();

  const handleModeChange = (mode) => {
    const modeConfig = suspensionModes.find(m => m.name === mode);
    if (modeConfig) {
      setHeight([modeConfig.height]);
      setStiffness({
        front: [modeConfig.stiffness.front],
        rear: [modeConfig.stiffness.rear]
      });
      setActiveMode(mode);
      
      toast({
        title: `Modo ${mode} activado`,
        description: modeConfig.description,
      });
    }
  };

  const getHeightStatus = () => {
    const h = height[0];
    if (h < 30) return { text: 'Muy Bajo', color: 'text-red-400' };
    if (h < 60) return { text: 'Bajo', color: 'text-orange-400' };
    if (h < 80) return { text: 'Normal', color: 'text-green-400' };
    return { text: 'Alto', color: 'text-blue-400' };
  };

  const getStiffnessStatus = (value) => {
    if (value < 30) return { text: 'Suave', color: 'text-green-400' };
    if (value < 60) return { text: 'Medio', color: 'text-yellow-400' };
    if (value < 80) return { text: 'Rígido', color: 'text-orange-400' };
    return { text: 'Muy Rígido', color: 'text-red-400' };
  };

  const heightStatus = getHeightStatus();
  const frontStiffnessStatus = getStiffnessStatus(stiffness.front[0]);
  const rearStiffnessStatus = getStiffnessStatus(stiffness.rear[0]);

  return (
    <div className="space-y-6">
      
      {/* Suspension Mode Selection */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-orange-400">
              Control de Suspensión Dinámica
            </h3>
            <div className="flex items-center space-x-4">
              <Badge className="bg-orange-600">{activeMode}</Badge>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-400">Auto-Ajuste:</span>
                <Switch 
                  checked={autoAdjust} 
                  onCheckedChange={setAutoAdjust}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {suspensionModes.map((mode) => (
              <Button
                key={mode.name}
                variant={activeMode === mode.name ? "default" : "outline-solid"}
                onClick={() => handleModeChange(mode.name)}
                disabled={disabled}
                className={`h-20 flex flex-col ${
                  activeMode === mode.name 
                    ? 'bg-orange-600 hover:bg-orange-700' 
                    : 'border-slate-600 hover:border-orange-400'
                }`}
              >
                <mode.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">{mode.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Height Control */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-blue-400">
              Control de Altura del Chasis
            </h3>
            <Badge variant="outline" className={heightStatus.color}>
              {heightStatus.text}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHeight([Math.max(0, height[0] - 10)])}
                disabled={disabled}
              >
                <ArrowDown className="w-4 h-4 mr-2" />
                Bajar
              </Button>
              <span className={`text-2xl font-bold ${heightStatus.color}`}>
                {height[0]}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setHeight([Math.min(100, height[0] + 10)])}
                disabled={disabled}
              >
                <ArrowUp className="w-4 h-4 mr-2" />
                Subir
              </Button>
            </div>
            
            <Slider
              value={height}
              onValueChange={setHeight}
              max={100}
              step={1}
              className="w-full"
              disabled={disabled}
            />
            
            <div className="text-xs text-slate-500 text-center">
              0% = Mínima altura para máxima estabilidad | 100% = Máxima altura para superar obstáculos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stiffness Control */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Front Suspension */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-green-400">
                Suspensión Delantera
              </h3>
              <Badge variant="outline" className={frontStiffnessStatus.color}>
                {frontStiffnessStatus.text}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Rigidez</span>
                <span className={`text-lg font-bold ${frontStiffnessStatus.color}`}>
                  {stiffness.front[0]}%
                </span>
              </div>
              
              <Slider
                value={stiffness.front}
                onValueChange={(value) => setStiffness(prev => ({ ...prev, front: value }))}
                max={100}
                step={1}
                className="w-full"
                disabled={disabled}
              />
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>• Suave: Mejor absorción de impactos</div>
                <div>• Rígido: Mayor control y estabilidad</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rear Suspension */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-red-400">
                Suspensión Trasera
              </h3>
              <Badge variant="outline" className={rearStiffnessStatus.color}>
                {rearStiffnessStatus.text}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Rigidez</span>
                <span className={`text-lg font-bold ${rearStiffnessStatus.color}`}>
                  {stiffness.rear[0]}%
                </span>
              </div>
              
              <Slider
                value={stiffness.rear}
                onValueChange={(value) => setStiffness(prev => ({ ...prev, rear: value }))}
                max={100}
                step={1}
                className="w-full"
                disabled={disabled}
              />
              
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>• Suave: Mejor tracción en terreno irregular</div>
                <div>• Rígido: Mejor para saltos y aterrizajes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Feedback */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-purple-400 mb-4">
            Estado en Tiempo Real
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Compresión FL</div>
              <Progress value={45} className="h-2 mb-1" />
              <div className="text-xs text-purple-400">45%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Compresión FR</div>
              <Progress value={52} className="h-2 mb-1" />
              <div className="text-xs text-purple-400">52%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Compresión RL</div>
              <Progress value={38} className="h-2 mb-1" />
              <div className="text-xs text-purple-400">38%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-slate-400 mb-1">Compresión RR</div>
              <Progress value={41} className="h-2 mb-1" />
              <div className="text-xs text-purple-400">41%</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuspensionControl;