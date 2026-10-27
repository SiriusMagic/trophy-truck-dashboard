import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { 
  Shield,
  DoorOpen,
  DoorClosed,
  UserCheck,
  UserX,
  AlertTriangle,
  CheckCircle,
  Car,
  Users,
  Lock,
  Unlock,
  ArrowUp
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const SecuritySystem = ({ vehicleData, disabled, onSecurityStatusChange }) => {
  const [doorsStatus, setDoorsStatus] = useState({
    frontLeft: false,    // false = cerrada, true = abierta
    frontRight: false,
    rearLeft: false,
    rearRight: false,
    hatch: false         // compuerta
  });

  const [seatbelts, setSeatbelts] = useState({
    driver: true,        // true = abrochado, false = no abrochado
    passenger: false,
    rearLeft: true,
    rearRight: false
  });

  const [autoLock, setAutoLock] = useState(true);
  
  const { toast } = useToast();

  // Simular cambios aleatorios en puertas y cinturones
  useEffect(() => {
    const interval = setInterval(() => {
      if (!disabled && Math.random() > 0.92) {
        // Cambiar estado aleatorio de puertas (raro)
        const doors = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight', 'hatch'];
        const randomDoor = doors[Math.floor(Math.random() * doors.length)];
        setDoorsStatus(prev => ({
          ...prev,
          [randomDoor]: Math.random() > 0.7
        }));
      }
      
      if (!disabled && Math.random() > 0.88) {
        // Cambiar estado de cinturones (más frecuente)
        const belts = ['driver', 'passenger', 'rearLeft', 'rearRight'];
        const randomBelt = belts[Math.floor(Math.random() * belts.length)];
        setSeatbelts(prev => ({
          ...prev,
          [randomBelt]: Math.random() > 0.3
        }));
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [disabled]); // Removed doorsStatus and seatbelts from dependencies

  // Notificar cambios de seguridad al componente padre
  useEffect(() => {
    const openDoors = Object.entries(doorsStatus).filter(([_, isOpen]) => isOpen);
    const unbuckledBelts = Object.entries(seatbelts).filter(([_, isBuckled]) => !isBuckled);
    
    if (onSecurityStatusChange) {
      onSecurityStatusChange({
        openDoors: openDoors.map(([door, _]) => door),
        unbuckledBelts: unbuckledBelts.map(([belt, _]) => belt),
        hasSecurityIssues: openDoors.length > 0 || unbuckledBelts.length > 0
      });
    }
  }, [doorsStatus, seatbelts]); // Removed onSecurityStatusChange from dependencies

  const doorNames = {
    frontLeft: 'Puerta Delantera Izq.',
    frontRight: 'Puerta Delantera Der.',
    rearLeft: 'Puerta Trasera Izq.',
    rearRight: 'Puerta Trasera Der.',
    hatch: 'Compuerta Trasera'
  };

  const seatNames = {
    driver: 'Conductor',
    passenger: 'Pasajero',
    rearLeft: 'Asiento Trasero Izq.',
    rearRight: 'Asiento Trasero Der.'
  };

  const toggleDoor = (door) => {
    setDoorsStatus(prev => ({
      ...prev,
      [door]: !prev[door]
    }));
    
    const newStatus = !doorsStatus[door];
    toast({
      title: `${doorNames[door]}`,
      description: newStatus ? '🔴 Puerta abierta' : '🔵 Puerta cerrada',
    });
  };

  const toggleSeatbelt = (seat) => {
    setSeatbelts(prev => ({
      ...prev,
      [seat]: !prev[seat]
    }));
    
    const newStatus = !seatbelts[seat];
    toast({
      title: `Cinturón ${seatNames[seat]}`,
      description: newStatus ? '✅ Cinturón abrochado' : '🔴 Cinturón desabrochado',
    });
  };

  const lockAllDoors = () => {
    setDoorsStatus({
      frontLeft: false,
      frontRight: false,
      rearLeft: false,
      rearRight: false,
      hatch: false
    });
    
    toast({
      title: '🔒 Todas las puertas cerradas',
      description: 'Sistema de seguridad activado',
    });
  };

  const getOpenDoorsCount = () => {
    return Object.values(doorsStatus).filter(isOpen => isOpen).length;
  };

  const getUnbuckledBeltsCount = () => {
    return Object.values(seatbelts).filter(isBuckled => !isBuckled).length;
  };

  const getSecurityLevel = () => {
    const openDoors = getOpenDoorsCount();
    const unbuckledBelts = getUnbuckledBeltsCount();
    
    if (openDoors === 0 && unbuckledBelts === 0) return 'high';
    if (openDoors <= 1 && unbuckledBelts <= 1) return 'medium';
    return 'low';
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="space-y-6">
      
      {/* Header del Sistema de Seguridad */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Shield className="w-8 h-8 text-blue-400" />
              <h3 className="text-xl font-semibold text-blue-400">
                Sistema de Seguridad del Vehículo
              </h3>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={securityLevel === 'high' ? "default" : securityLevel === 'medium' ? "outline-solid" : "destructive"}>
                {securityLevel === 'high' ? '🛡️ SEGURO' : securityLevel === 'medium' ? '⚠️ PRECAUCIÓN' : '🚨 ALERTA'}
              </Badge>
              <Badge variant="outline">
                {getOpenDoorsCount()} PUERTAS ABIERTAS
              </Badge>
              <Badge variant="outline">
                {getUnbuckledBeltsCount()} CINTURONES SUELTOS
              </Badge>
            </div>
          </div>
          
          {/* Auto-lock toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Lock className="w-5 h-5 text-yellow-400" />
              <div>
                <div className="font-semibold text-white">Bloqueo Automático</div>
                <div className="text-xs text-slate-400">Cierra puertas automáticamente al conducir</div>
              </div>
            </div>
            <Switch
              checked={autoLock}
              onCheckedChange={setAutoLock}
              disabled={disabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Estado de Puertas */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-purple-400 flex items-center">
              <DoorOpen className="w-5 h-5 mr-2" />
              Estado de Puertas y Compuerta
            </h4>
            <Button
              variant="outline"
              onClick={lockAllDoors}
              disabled={disabled}
              className="text-green-400 border-green-400 hover:bg-green-400/10"
            >
              <Lock className="w-4 h-4 mr-2" />
              Cerrar Todas
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(doorsStatus).map(([door, isOpen]) => (
              <div key={door} className="relative">
                <Button
                  variant="outline"
                  onClick={() => toggleDoor(door)}
                  disabled={disabled}
                  className={`w-full h-20 flex flex-col items-center justify-center border-2 ${
                    isOpen 
                      ? 'border-red-500 bg-red-900/20 text-red-400' 
                      : 'border-blue-500 bg-blue-900/20 text-blue-400'
                  }`}
                >
                  {isOpen ? (
                    <DoorOpen className="w-8 h-8 mb-2 text-red-400" />
                  ) : (
                    <DoorClosed className="w-8 h-8 mb-2 text-blue-400" />
                  )}
                  <span className="text-xs font-semibold text-center">
                    {doorNames[door]}
                  </span>
                  <span className={`text-xs ${isOpen ? 'text-red-400' : 'text-blue-400'}`}>
                    {isOpen ? 'ABIERTA' : 'CERRADA'}
                  </span>
                </Button>
                {isOpen && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Estado de Cinturones */}
      <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-green-400 mb-6 flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Estado de Cinturones de Seguridad
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(seatbelts).map(([seat, isBuckled]) => (
              <div key={seat} className="relative">
                <Button
                  variant="outline"
                  onClick={() => toggleSeatbelt(seat)}
                  disabled={disabled}
                  className={`w-full h-16 flex items-center justify-start border-2 px-4 ${
                    isBuckled 
                      ? 'border-green-500 bg-green-900/20 text-green-400' 
                      : 'border-red-500 bg-red-900/20 text-red-400'
                  }`}
                >
                  {isBuckled ? (
                    <UserCheck className="w-6 h-6 mr-3 text-green-400" />
                  ) : (
                    <UserX className="w-6 h-6 mr-3 text-red-400" />
                  )}
                  <div className="text-left">
                    <div className="font-semibold">{seatNames[seat]}</div>
                    <div className={`text-xs ${isBuckled ? 'text-green-400' : 'text-red-400'}`}>
                      {isBuckled ? '✅ Cinturón Abrochado' : '🔴 Cinturón Suelto'}
                    </div>
                  </div>
                </Button>
                {!isBuckled && (
                  <div className="absolute -top-1 -right-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getOpenDoorsCount() > 0 ? 'text-red-400' : 'text-blue-400'}`}>
              {5 - getOpenDoorsCount()}/5
            </div>
            <div className="text-xs text-slate-400">Puertas Cerradas</div>
            {getOpenDoorsCount() > 0 && (
              <div className="text-xs text-red-400 mt-1">
                {getOpenDoorsCount()} abiertas
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${getUnbuckledBeltsCount() > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {4 - getUnbuckledBeltsCount()}/4
            </div>
            <div className="text-xs text-slate-400">Cinturones Abrochados</div>
            {getUnbuckledBeltsCount() > 0 && (
              <div className="text-xs text-red-400 mt-1">
                {getUnbuckledBeltsCount()} sueltos
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-900/50 border-slate-700 backdrop-blur-xs">
          <CardContent className="p-4 text-center">
            <div className={`text-2xl font-bold ${
              securityLevel === 'high' ? 'text-green-400' : 
              securityLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {securityLevel === 'high' ? '🛡️' : securityLevel === 'medium' ? '⚠️' : '🚨'}
            </div>
            <div className="text-xs text-slate-400">Nivel de Seguridad</div>
            <div className={`text-xs mt-1 ${
              securityLevel === 'high' ? 'text-green-400' : 
              securityLevel === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {securityLevel === 'high' ? 'ALTO' : securityLevel === 'medium' ? 'MEDIO' : 'BAJO'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SecuritySystem;