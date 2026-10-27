import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Plane,
  Car,
  Shield,
  Thermometer,
  Battery,
  Zap,
  Radar,
  DoorOpen
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CodesSystem = ({ vehicleData, disabled }) => {
  const [activeCodes, setActiveCodes] = useState([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all', 'drone', 'vehicle'
  
  const { toast } = useToast();

  // Mapeo de códigos de error para el vehículo y el dron 
  const codigos_de_fallo = {
    // Códigos para el Dron
    "P001": {
      message: "Error en el motor 1 del dron. Verifique la conexión.",
      category: "drone",
      severity: "high",
      icon: Plane,
      color: "red"
    },
    "P002": {
      message: "Batería del dron en nivel crítico. Aterrice de inmediato.",
      category: "drone", 
      severity: "critical",
      icon: Battery,
      color: "red"
    },
    "P003": {
      message: "Fallo en la compuerta de despliegue. Atascada o bloqueada.",
      category: "drone",
      severity: "medium",
      icon: DoorOpen,
      color: "orange"
    },
    
    // Códigos para el Vehículo (auto eléctrico)
    "V01A": {
      message: "Alerta: Batería principal del vehículo con nivel bajo. Cargar pronto.",
      category: "vehicle",
      severity: "medium",
      icon: Battery,
      color: "yellow"
    },
    "V02C": {
      message: "Error de carga en el puerto. Verifique el cable.",
      category: "vehicle",
      severity: "medium", 
      icon: Zap,
      color: "orange"
    },
    "V03M": {
      message: "Fallo en el motor eléctrico principal. Requiere revisión.",
      category: "vehicle",
      severity: "high",
      icon: Car,
      color: "red"
    },
    "V04L": {
      message: "Fallo en el sensor de baches (LiDAR). Mapeo impreciso.",
      category: "vehicle",
      severity: "medium",
      icon: Radar,
      color: "orange"
    },
    "S01": {
      message: "Seguro de la puerta del conductor no activado.",
      category: "vehicle",
      severity: "low",
      icon: Shield,
      color: "yellow"
    },
    "S02": {
      message: "Seguro de la puerta del pasajero no activado.",
      category: "vehicle", 
      severity: "low",
      icon: Shield,
      color: "yellow"
    },
    "T01": {
      message: "Temperatura de las baterías del vehículo elevada.",
      category: "vehicle",
      severity: "high",
      icon: Thermometer,
      color: "red"
    }
  };

  // Simular códigos activos basados en el estado del vehículo
  useEffect(() => {
    const generateActiveCodes = () => {
      let codes = [];
      
      if (!disabled) {
        // Simular códigos basados en condiciones del vehículo
        if (vehicleData.batteryLevel < 20) {
          codes.push("V01A");
        }
        
        if (vehicleData.batteryTemp > 45) {
          codes.push("T01");
        }
        
        // Simular códigos aleatorios ocasionalmente
        if (Math.random() > 0.85) {
          const allCodes = Object.keys(codigos_de_fallo);
          const randomCode = allCodes[Math.floor(Math.random() * allCodes.length)];
          if (!codes.includes(randomCode)) {
            codes.push(randomCode);
          }
        }
      }
      
      setActiveCodes(codes);
    };

    const interval = setInterval(generateActiveCodes, 5000);
    generateActiveCodes(); // Initial call
    
    return () => clearInterval(interval);
  }, [vehicleData, disabled]);

  // Filtrar códigos
  const getFilteredCodes = () => {
    let filtered = Object.entries(codigos_de_fallo);
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(([code, data]) => data.category === categoryFilter);
    }
    
    if (searchFilter) {
      filtered = filtered.filter(([code, data]) => 
        code.toLowerCase().includes(searchFilter.toLowerCase()) ||
        data.message.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }
    
    return filtered;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-900/30 border-red-400';
      case 'high': return 'text-red-300 bg-red-800/20 border-red-300';
      case 'medium': return 'text-orange-300 bg-orange-800/20 border-orange-300';
      case 'low': return 'text-yellow-300 bg-yellow-800/20 border-yellow-300';
      default: return 'text-slate-300 bg-slate-800/20 border-slate-300';
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      critical: 'destructive',
      high: 'destructive', 
      medium: 'outline-solid',
      low: 'secondary'
    };
    return colors[severity] || 'outline-solid';
  };

  const clearCode = (code) => {
    setActiveCodes(prev => prev.filter(c => c !== code));
    toast({
      title: `Código ${code} limpiado`,
      description: "Código de error resuelto y eliminado del sistema",
    });
  };

  const filteredCodes = getFilteredCodes();
  const activeCodesData = activeCodes.map(code => [code, codigos_de_fallo[code]]);

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema de Códigos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-amber-400" />
              <h3 className="text-xl font-semibold text-amber-400">
                Sistema de Códigos de Diagnóstico
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={activeCodes.length > 0 ? "destructive" : "outline-solid"}>
                {activeCodes.length} CÓDIGOS ACTIVOS
              </Badge>
              <Badge variant="outline">
                {Object.keys(codigos_de_fallo).length} TOTAL CÓDIGOS
              </Badge>
            </div>
          </div>
          
          {/* Filtros y Búsqueda */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Buscar código o descripción</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Ej: P001, batería, motor..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-hidden focus:border-cyan-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Filtrar por categoría</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'all', label: 'Todos', icon: AlertTriangle },
                  { id: 'drone', label: 'Dron', icon: Plane },
                  { id: 'vehicle', label: 'Vehículo', icon: Car }
                ].map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline-solid"}
                    onClick={() => setCategoryFilter(category.id)}
                    className="flex items-center justify-center space-x-1 text-xs"
                  >
                    <category.icon className="w-3 h-3" />
                    <span>{category.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Códigos Activos */}
      {activeCodes.length > 0 && (
        <Card className="bg-slate-900/50 border-red-500/50 backdrop-blur-xs">
          <CardContent className="p-6">
            <h4 className="text-lg font-semibold text-red-400 mb-4 flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              Códigos Activos - Requieren Atención
            </h4>
            
            <div className="space-y-3">
              {activeCodesData.map(([code, data]) => {
                const IconComponent = data.icon;
                return (
                  <div key={code} className={`p-4 rounded-lg border ${getSeverityColor(data.severity)}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <IconComponent className={`w-5 h-5 text-${data.color}-400`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white">{code}</span>
                            <Badge variant={getSeverityBadge(data.severity)} className="text-xs">
                              {data.severity.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {data.category === 'drone' ? 'DRON' : 'VEHÍCULO'}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">{data.message}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => clearCode(code)}
                        className="text-green-400 border-green-400 hover:bg-green-400/10"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Limpiar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Biblioteca de Códigos */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-4">
            Biblioteca de Códigos de Diagnóstico
          </h4>
          
          <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
            {filteredCodes.map(([code, data]) => {
              const IconComponent = data.icon;
              const isActive = activeCodes.includes(code);
              
              return (
                <div 
                  key={code} 
                  className={`p-3 rounded-lg border transition-all ${
                    isActive 
                      ? `border-${data.color}-500 bg-${data.color}-900/20` 
                      : 'border-slate-600 bg-slate-800/30 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-4 h-4 mt-1 ${
                      isActive ? `text-${data.color}-400` : 'text-slate-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {code}
                        </span>
                        <Badge variant={getSeverityBadge(data.severity)} className="text-xs">
                          {data.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {data.category === 'drone' ? 'DRON' : 'VEHÍCULO'}
                        </Badge>
                        {isActive && (
                          <Badge variant="destructive" className="text-xs animate-pulse">
                            ACTIVO
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${isActive ? 'text-slate-200' : 'text-slate-400'}`}>
                        {data.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredCodes.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto text-slate-500 mb-2" />
              <p className="text-slate-500">No se encontraron códigos con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas de Códigos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">
              {Object.entries(codigos_de_fallo).filter(([_, data]) => data.severity === 'critical' || data.severity === 'high').length}
            </div>
            <div className="text-xs text-slate-400">Códigos Críticos</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-cyan-400">
              {Object.entries(codigos_de_fallo).filter(([_, data]) => data.category === 'drone').length}
            </div>
            <div className="text-xs text-slate-400">Códigos de Dron</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">
              {Object.entries(codigos_de_fallo).filter(([_, data]) => data.category === 'vehicle').length}
            </div>
            <div className="text-xs text-slate-400">Códigos de Vehículo</div>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">
              {activeCodes.length}
            </div>
            <div className="text-xs text-slate-400">Actualmente Activos</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CodesSystem;