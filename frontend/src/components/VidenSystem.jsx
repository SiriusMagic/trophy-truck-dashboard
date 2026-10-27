import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Scan, 
  Mic, 
  Eye, 
  Watch, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2,
  User
} from 'lucide-react';

const VidenSystem = () => {
  const [activeSystem, setActiveSystem] = useState(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanResults, setScanResults] = useState({});
  const [facialPoints, setFacialPoints] = useState([]);
  const [audioWave, setAudioWave] = useState([]);

  // Generar puntos para escaneo facial
  const generateFacialPoints = () => {
    const points = [];
    for (let i = 0; i < 12; i++) {
      points.push({
        id: i,
        x: Math.random() * 200,
        y: Math.random() * 160,
        active: false
      });
    }
    setFacialPoints(points);
  };

  // Generar ondas de audio
  const generateAudioWave = () => {
    const wave = [];
    for (let i = 0; i < 20; i++) {
      wave.push({
        id: i,
        height: Math.random() * 60 + 20
      });
    }
    setAudioWave(wave);
  };

  // Simulación de escaneo facial
  const startFacialScan = () => {
    setActiveSystem('facial');
    setScanProgress(0);
    generateFacialPoints();
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const success = Math.random() > 0.3; // 70% éxito
          setScanResults({
            facial: success ? 'success' : 'failed',
            message: success ? 'Acceso Concedido' : 'Acceso Denegado: Rostro Estático'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Animar puntos
    const pointInterval = setInterval(() => {
      setFacialPoints(prev => prev.map(point => ({
        ...point,
        active: Math.random() > 0.7,
        x: point.x + (Math.random() - 0.5) * 10,
        y: point.y + (Math.random() - 0.5) * 10
      })));
      
      if (scanProgress >= 100) {
        clearInterval(pointInterval);
      }
    }, 200);
  };

  // Simulación de dispositivo inteligente
  const startDeviceScan = () => {
    setActiveSystem('device');
    setScanProgress(0);
    setScanResults({ device: 'searching', message: 'Buscando Dispositivo...' });
    
    setTimeout(() => {
      setScanProgress(50);
      const found = Math.random() > 0.2; // 80% éxito
      if (found) {
        setScanResults({
          device: 'found',
          message: 'Dispositivo Encontrado: Pulsera de Usuario Alpha'
        });
        setScanProgress(100);
      } else {
        setScanResults({
          device: 'failed',
          message: 'Dispositivo no encontrado. Intente de nuevo'
        });
        setScanProgress(0);
      }
    }, 2000);
  };

  // Simulación de reconocimiento de voz
  const startVoiceScan = () => {
    setActiveSystem('voice');
    setScanProgress(0);
    generateAudioWave();
    setScanResults({ voice: 'listening', message: 'Di la frase de activación...' });
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          const success = Math.random() > 0.25; // 75% éxito
          setScanResults({
            voice: success ? 'success' : 'failed',
            message: success ? 'Voz Reconocida: Acceso Permitido' : 'Voz no Coincide: Acceso Denegado'
          });
          return 100;
        }
        return prev + 12;
      });
    }, 400);

    // Animar ondas de audio
    const waveInterval = setInterval(() => {
      generateAudioWave();
      if (scanProgress >= 100) {
        clearInterval(waveInterval);
      }
    }, 150);
  };

  // Simulación de sistema dual (Iris + Voz)
  const [dualStep, setDualStep] = useState(1);
  const [dualResults, setDualResults] = useState({});

  const startDualScan = () => {
    setActiveSystem('dual');
    setDualStep(1);
    setDualResults({});
    setScanProgress(0);
    setScanResults({ dual: 'voice_step', message: 'Paso 1: Di la frase de activación' });
    generateAudioWave();

    // Paso 1: Voz
    setTimeout(() => {
      const voiceSuccess = Math.random() > 0.2;
      setDualResults({ voice: voiceSuccess });
      
      if (voiceSuccess) {
        setScanResults({ dual: 'voice_confirmed', message: 'Paso 1: Voz Confirmada' });
        setScanProgress(50);
        
        // Paso 2: Iris
        setTimeout(() => {
          setDualStep(2);
          setScanResults({ dual: 'iris_step', message: 'Paso 2: Escaneo de Iris' });
          
          setTimeout(() => {
            const irisSuccess = Math.random() > 0.15;
            setDualResults(prev => ({ ...prev, iris: irisSuccess }));
            
            if (irisSuccess) {
              setScanResults({ dual: 'success', message: 'Acceso Total Concedido' });
              setScanProgress(100);
            } else {
              setScanResults({ dual: 'failed', message: 'Paso 2 Fallido: Iris no Reconocido' });
              setScanProgress(50);
            }
          }, 2000);
        }, 1500);
      } else {
        setScanResults({ dual: 'failed', message: 'Paso 1 Fallido: Voz no Reconocida' });
        setScanProgress(25);
      }
    }, 3000);
  };

  const resetSystem = () => {
    setActiveSystem(null);
    setScanProgress(0);
    setScanResults({});
    setDualStep(1);
    setDualResults({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-400';
      case 'failed': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8 text-blue-400" />
          VIDEN - Sistemas de Autenticación
        </h2>
        <p className="text-gray-400">Protocolos Biométricos de Seguridad Avanzada</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sistema 1: Reconocimiento Facial 2da Gen */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-400">
              <Scan className="w-6 h-6" />
              Reconocimiento Facial 2da Gen
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 bg-black rounded-lg relative border-2 border-slate-600 overflow-hidden">
              {activeSystem === 'facial' && facialPoints.length > 0 && (
                <>
                  {facialPoints.map((point) => (
                    <div
                      key={point.id}
                      className={`absolute w-2 h-2 rounded-full transition-all duration-200 ${
                        point.active ? 'bg-blue-400 animate-pulse' : 'bg-blue-600'
                      }`}
                      style={{
                        left: `${Math.max(0, Math.min(point.x, 190))}px`,
                        top: `${Math.max(0, Math.min(point.y, 150))}px`
                      }}
                    />
                  ))}
                  <div className="absolute inset-4 border-2 border-blue-400 rounded-lg animate-pulse">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <User className="w-16 h-16 text-blue-300 opacity-30" />
                    </div>
                  </div>
                </>
              )}
              {activeSystem !== 'facial' && (
                <div className="flex items-center justify-center h-full">
                  <User className="w-20 h-20 text-gray-600" />
                </div>
              )}
            </div>
            
            {activeSystem === 'facial' && (
              <Progress value={scanProgress} className="h-2" />
            )}
            
            <Button 
              onClick={startFacialScan} 
              disabled={activeSystem && activeSystem !== 'facial'}
              className="w-full"
            >
              Iniciar Escaneo Facial
            </Button>
            
            {scanResults.facial && (
              <div className={`text-center font-semibold ${getStatusColor(scanResults.facial)}`}>
                {scanResults.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sistema 2: Pulsera/Anillo Inteligente */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-400">
              <Watch className="w-6 h-6" />
              Dispositivo Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center relative">
              {activeSystem === 'device' && (
                <div className="text-center">
                  {scanResults.device === 'searching' && (
                    <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto mb-4" />
                  )}
                  {scanResults.device === 'found' && (
                    <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  )}
                  {scanResults.device === 'failed' && (
                    <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                  )}
                </div>
              )}
              {activeSystem !== 'device' && (
                <Watch className="w-20 h-20 text-gray-600" />
              )}
            </div>
            
            {activeSystem === 'device' && (
              <Progress value={scanProgress} className="h-2" />
            )}
            
            <Button 
              onClick={startDeviceScan} 
              disabled={activeSystem && activeSystem !== 'device'}
              className="w-full"
            >
              Buscar Dispositivo
            </Button>
            
            {scanResults.device && (
              <div className={`text-center font-semibold ${getStatusColor(scanResults.device)}`}>
                {scanResults.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sistema 3: Reconocimiento de Voz */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-green-400">
              <Mic className="w-6 h-6" />
              Voz Única
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center relative">
              {activeSystem === 'voice' && audioWave.length > 0 && (
                <div className="flex items-end space-x-1">
                  {audioWave.map((bar) => (
                    <div
                      key={bar.id}
                      className="bg-green-400 w-3 animate-pulse"
                      style={{
                        height: `${bar.height}px`,
                        animationDelay: `${bar.id * 50}ms`
                      }}
                    />
                  ))}
                </div>
              )}
              {activeSystem !== 'voice' && (
                <Mic className="w-20 h-20 text-gray-600" />
              )}
            </div>
            
            {activeSystem === 'voice' && (
              <Progress value={scanProgress} className="h-2" />
            )}
            
            <Button 
              onClick={startVoiceScan} 
              disabled={activeSystem && activeSystem !== 'voice'}
              className="w-full"
            >
              Activar Reconocimiento
            </Button>
            
            {scanResults.voice && (
              <div className={`text-center font-semibold ${getStatusColor(scanResults.voice)}`}>
                {scanResults.message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sistema 4: Iris + Voz Combinado */}
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-orange-400">
              <Eye className="w-6 h-6" />
              Iris + Voz (Máxima Seguridad)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-48 bg-slate-800 rounded-lg flex items-center justify-center relative">
              {activeSystem === 'dual' && (
                <div className="text-center">
                  {dualStep === 1 && (
                    <div>
                      <Mic className="w-16 h-16 text-orange-400 mx-auto mb-2 animate-pulse" />
                      <div className="flex justify-center space-x-1">
                        {audioWave.slice(0, 10).map((bar) => (
                          <div
                            key={bar.id}
                            className="bg-orange-400 w-2 animate-pulse"
                            style={{ height: `${bar.height / 2}px` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {dualStep === 2 && (
                    <Eye className="w-16 h-16 text-orange-400 mx-auto animate-pulse" />
                  )}
                  
                  <div className="mt-4 space-y-1">
                    <Badge variant={dualResults.voice === true ? "default" : "secondary"}>
                      Voz: {dualResults.voice === true ? "✓" : dualResults.voice === false ? "✗" : "..."}
                    </Badge>
                    <Badge variant={dualResults.iris === true ? "default" : "secondary"}>
                      Iris: {dualResults.iris === true ? "✓" : dualResults.iris === false ? "✗" : "..."}
                    </Badge>
                  </div>
                </div>
              )}
              {activeSystem !== 'dual' && (
                <div className="text-center">
                  <Eye className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                  <Mic className="w-12 h-12 text-gray-600 mx-auto" />
                </div>
              )}
            </div>
            
            {activeSystem === 'dual' && (
              <Progress value={scanProgress} className="h-2" />
            )}
            
            <Button 
              onClick={startDualScan} 
              disabled={activeSystem && activeSystem !== 'dual'}
              className="w-full"
            >
              Iniciar Protocolo Dual
            </Button>
            
            {scanResults.dual && (
              <div className={`text-center font-semibold ${getStatusColor(scanResults.dual)}`}>
                {scanResults.message}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {activeSystem && (
        <div className="text-center">
          <Button onClick={resetSystem} variant="outline" className="mt-4">
            Reiniciar Sistemas
          </Button>
        </div>
      )}
    </div>
  );
};

export default VidenSystem;