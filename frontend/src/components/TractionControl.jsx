import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { 
  Car,
  ArrowUp,
  ArrowDown,
  ArrowLeftRight,
  Zap,
  Settings,
  Mountain
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TractionControl = ({ disabled }) => {
  const [activeMode, setActiveMode] = useState('AWD permanente');
  const { toast } = useToast();

  const tractionModes = [
    { 
      id: 'FWD', 
      name: 'FWD', 
      desc: 'Tracción delantera',
      icon: ArrowUp,
      color: 'bg-blue-600',
      distribution: [0, 100] // [rear, front]
    },
    { 
      id: 'RWD', 
      name: 'RWD', 
      desc: 'Tracción trasera',
      icon: ArrowDown,
      color: 'bg-red-600',
      distribution: [100, 0]
    },
    { 
      id: 'AWD permanente', 
      name: 'AWD Permanente', 
      desc: 'Tracción integral constante',
      icon: ArrowLeftRight,
      color: 'bg-purple-600',
      distribution: [50, 50]
    },
    { 
      id: 'AWD bajo demanda', 
      name: 'AWD Bajo Demanda', 
      desc: 'Tracción integral automática',
      icon: Car,
      color: 'bg-cyan-600',
      distribution: [30, 70]
    },
    { 
      id: '4WD part-time', 
      name: '4WD Part-Time', 
      desc: 'Tracción 4x4 temporal',
      icon: Mountain,
      color: 'bg-orange-600',
      distribution: [50, 50]
    },
    { 
      id: '4WD con reductora', 
      name: '4WD con Reductora', 
      desc: 'Tracción 4x4 reducida',
      icon: Settings,
      color: 'bg-yellow-600',
      distribution: [50, 50]
    },
    { 
      id: 'AWD híbrido', 
      name: 'AWD Híbrido', 
      desc: 'AWD con e-axle eléctricos',
      icon: Zap,
      color: 'bg-green-600',
      distribution: [40, 60]
    }
  ];

  const handleModeChange = (mode) => {
    setActiveMode(mode.id);
    toast({
      title: `${mode.name} activado`,
      description: mode.desc,
    });
  };

  const getCurrentMode = () => tractionModes.find(m => m.id === activeMode);
  const currentMode = getCurrentMode();

  return (
    <div className="space-y-6">
      
      {/* Current Mode Display */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {currentMode?.name}
            </div>
            <div className="text-sm text-slate-400 mb-4">
              {currentMode?.desc}
            </div>
            <div className="flex justify-center space-x-8 text-sm">
              <div>
                <span className="text-red-400 font-bold">Trasera: {currentMode?.distribution[0]}%</span>
              </div>
              <div>
                <span className="text-blue-400 font-bold">Delantera: {currentMode?.distribution[1]}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-6">
            Selección de Modo de Tracción
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tractionModes.map((mode) => (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? "default" : "outline-solid"}
                onClick={() => handleModeChange(mode)}
                disabled={disabled}
                className={`h-20 flex flex-col ${
                  activeMode === mode.id ? mode.color : 'border-slate-600 hover:border-cyan-400'
                }`}
              >
                <mode.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-bold">{mode.name}</span>
                <span className="text-xs text-slate-400">{mode.desc}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Power Distribution Visualization */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6">
            Distribución de Potencia Actual
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-red-300 font-medium">Eje Trasero</span>
                <span className="text-red-400 font-bold">{currentMode?.distribution[0]}%</span>
              </div>
              <Progress value={currentMode?.distribution[0]} className="h-4" />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-300 font-medium">Eje Delantero</span>
                <span className="text-blue-400 font-bold">{currentMode?.distribution[1]}%</span>
              </div>
              <Progress value={currentMode?.distribution[1]} className="h-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TractionControl;