import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Sun,
  Thermometer,
  Zap,
  Volume2,
  Leaf,
  Battery,
  TrendingUp,
  Info,
  Plus,
  Target
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const TreeRSystem = ({ vehicleData, disabled }) => {
  const [treeRData, setTreeRData] = useState({
    baseAutonomy: 200, // km autonomía base
    sources: {
      photovoltaic: {
        name: 'Panel Fotovoltaico',
        icon: Sun,
        active: true,
        contribution: 18, // +km
        energyRate: 18, // Wh/h
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-600'
      },
      thermal: {
        name: 'Panel Térmico',
        icon: Thermometer,
        active: true,
        contribution: 12, // +km
        energyRate: 12, // Wh/h
        color: 'text-orange-400',
        bgColor: 'bg-orange-600'
      },
      piezoelectric: {
        name: 'Piezoeléctrico Suspensión',
        icon: Zap,
        active: true,
        contribution: 8, // +km
        energyRate: 8, // Wh/h
        color: 'text-purple-400',
        bgColor: 'bg-purple-600'
      },
      soundPiezo: {
        name: 'Sonido Piezoeléctrico',
        icon: Volume2,
        active: true,
        contribution: 4, // +km
        energyRate: 4, // Wh/h
        color: 'text-cyan-400',
        bgColor: 'bg-cyan-600'
      }
    }
  });

  const { toast } = useToast();

  // Simulate real-time energy generation based on conditions
  useEffect(() => {
    const interval = setInterval(() => {
      if (!disabled) {
        setTreeRData(prev => ({
          ...prev,
          sources: {
            ...prev.sources,
            photovoltaic: {
              ...prev.sources.photovoltaic,
              contribution: Math.round(18 + (Math.random() - 0.5) * 6), // 12-24 km
              energyRate: Math.round(18 + (Math.random() - 0.5) * 6)
            },
            thermal: {
              ...prev.sources.thermal,
              contribution: Math.round(12 + (Math.random() - 0.5) * 4), // 8-16 km
              energyRate: Math.round(12 + (Math.random() - 0.5) * 4)
            },
            piezoelectric: {
              ...prev.sources.piezoelectric,
              contribution: Math.round(8 + (vehicleData.speed > 50 ? 6 : 2)), // More at higher speeds
              energyRate: Math.round(8 + (vehicleData.speed > 50 ? 6 : 2))
            },
            soundPiezo: {
              ...prev.sources.soundPiezo,
              contribution: Math.round(4 + Math.random() * 3), // 4-7 km
              energyRate: Math.round(4 + Math.random() * 3)
            }
          }
        }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [vehicleData.speed, disabled]);

  const handleSourceToggle = (sourceKey) => {
    setTreeRData(prev => ({
      ...prev,
      sources: {
        ...prev.sources,
        [sourceKey]: {
          ...prev.sources[sourceKey],
          active: !prev.sources[sourceKey].active
        }
      }
    }));

    const sourceName = treeRData.sources[sourceKey].name;
    const isActive = treeRData.sources[sourceKey].active;
    
    toast({
      title: `${sourceName} ${isActive ? 'desactivado' : 'activado'}`,
      description: `Generación de energía ${isActive ? 'detenida' : 'iniciada'}`,
    });
  };

  const getTotalContribution = () => {
    return Object.values(treeRData.sources)
      .filter(source => source.active)
      .reduce((sum, source) => sum + source.contribution, 0);
  };

  const getTotalEnergyRate = () => {
    return Object.values(treeRData.sources)
      .filter(source => source.active)
      .reduce((sum, source) => sum + source.energyRate, 0);
  };

  const getTotalAutonomy = () => {
    return treeRData.baseAutonomy + getTotalContribution();
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        
        {/* TreeR System Overview */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Leaf className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-green-400">TreeR System</h3>
                <Leaf className="w-8 h-8 text-green-400" />
              </div>
              
              <div className="text-5xl font-bold text-cyan-400 mb-2">
                +{getTotalContribution()} km
              </div>
              <div className="text-lg text-slate-400 mb-4">
                Autonomía Adicional Generada
              </div>
              
              <div className="flex justify-center space-x-8 text-sm">
                <div className="flex items-center space-x-2">
                  <Battery className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400">Base: {treeRData.baseAutonomy} km</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-green-400" />
                  <span className="text-green-400">TreeR: +{getTotalContribution()} km</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  <span className="text-purple-400">Total: {getTotalAutonomy()} km</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center justify-center space-x-1 text-slate-400 hover:text-slate-300 cursor-help">
                      <Info className="w-4 h-4" />
                      <span className="text-sm">Generando {getTotalEnergyRate()} Wh/h</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Energía total generada por hora por todas las fuentes TreeR activas</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Energy Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(treeRData.sources).map(([key, source]) => (
            <Card key={key} className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <source.icon className={`w-6 h-6 ${source.color}`} />
                    <h4 className={`text-lg font-semibold ${source.color}`}>
                      {source.name}
                    </h4>
                  </div>
                  <Switch
                    checked={source.active}
                    onCheckedChange={() => handleSourceToggle(key)}
                    disabled={disabled}
                  />
                </div>
                
                <div className="space-y-4">
                  {/* Main contribution display */}
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${source.color} mb-1`}>
                      +{source.active ? source.contribution : 0} km
                    </div>
                    <div className="text-sm text-slate-400">
                      Contribución Individual
                    </div>
                  </div>
                  
                  {/* Energy breakdown */}
                  <div className="grid grid-cols-3 gap-4 text-center text-xs">
                    <div>
                      <div className={`font-bold ${source.color}`}>
                        {source.active ? source.contribution : 0} km
                      </div>
                      <div className="text-slate-500">Aporte</div>
                    </div>
                    <div>
                      <div className="font-bold text-blue-400">
                        {treeRData.baseAutonomy} km
                      </div>
                      <div className="text-slate-500">Base</div>
                    </div>
                    <div>
                      <div className="font-bold text-purple-400">
                        {treeRData.baseAutonomy + (source.active ? source.contribution : 0)} km
                      </div>
                      <div className="text-slate-500">Total</div>
                    </div>
                  </div>
                  
                  {/* Energy rate tooltip */}
                  <div className="text-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="inline-flex items-center space-x-1 text-slate-400 hover:text-slate-300 cursor-help">
                          <Zap className="w-4 h-4" />
                          <span className="text-sm">
                            {source.active ? source.energyRate : 0} Wh/h
                          </span>
                          <Info className="w-3 h-3" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Energía generada por hora por {source.name.toLowerCase()}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  
                  {/* Progress bar */}
                  <Progress 
                    value={source.active ? (source.contribution / 25) * 100 : 0} 
                    className="h-2" 
                  />
                  
                  {/* Source-specific info */}
                  <div className="text-xs text-slate-500 text-center">
                    {key === 'photovoltaic' && '☀️ Captación solar continua'}
                    {key === 'thermal' && '🔥 Conversión de calor residual'}
                    {key === 'piezoelectric' && '⚡ Energía de baches y desniveles'}
                    {key === 'soundPiezo' && '🔊 Captura de sonido externo'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* TreeR Performance Analytics */}
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-green-400 mb-6">
              Análisis de Rendimiento TreeR
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Real-time generation */}
              <div className="space-y-4">
                <h5 className="text-green-300 font-semibold flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Generación en Tiempo Real
                </h5>
                
                <div className="space-y-3">
                  {Object.entries(treeRData.sources).map(([key, source]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <source.icon className={`w-4 h-4 ${source.color}`} />
                        <span className="text-sm text-slate-300">
                          {source.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`text-sm font-bold ${source.color}`}>
                          +{source.active ? source.contribution : 0} km
                        </div>
                        <div className="text-xs text-slate-500">
                          ({source.active ? source.energyRate : 0} Wh/h)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System efficiency */}
              <div className="space-y-4">
                <h5 className="text-green-300 font-semibold">Eficiencia del Sistema</h5>
                
                <div className="space-y-3">
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {Math.round((getTotalContribution() / treeRData.baseAutonomy) * 100)}%
                    </div>
                    <div className="text-sm text-slate-400">Incremento de Autonomía</div>
                  </div>
                  
                  <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-cyan-400 mb-1">
                      {getTotalEnergyRate()} Wh/h
                    </div>
                    <div className="text-sm text-slate-400">Generación Total</div>
                  </div>
                  
                  <div className="text-xs text-slate-500 text-center">
                    🌱 Sistema TreeR capturando energía del entorno 24/7
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TreeR Formula Display */}
        <Card className="bg-green-900/20 border-green-500/30 backdrop-blur-xs">
          <CardContent className="p-6">
            <div className="text-center">
              <h4 className="text-lg font-semibold text-green-400 mb-4">
                Fórmula TreeR Activa
              </h4>
              
              <div className="flex items-center justify-center space-x-4 text-lg">
                <span className="text-blue-400 font-bold">{treeRData.baseAutonomy} km</span>
                <span className="text-slate-400">+</span>
                <span className="text-green-400 font-bold">{getTotalContribution()} km</span>
                <span className="text-slate-400">=</span>
                <span className="text-purple-400 font-bold text-xl">{getTotalAutonomy()} km</span>
              </div>
              
              <div className="mt-2 text-sm text-slate-400">
                Base + TreeR = Autonomía Total
              </div>
              
              <div className="mt-4 text-xs text-slate-500">
                💡 TreeR: Tecnología de Captura de Energía Renovable Regenerativa
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default TreeRSystem;