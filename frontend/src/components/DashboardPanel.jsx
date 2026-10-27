import React, { useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Wifi, Bluetooth, Battery, Gauge, Thermometer, Bell, Settings as SettingsIcon, SlidersHorizontal, Car } from "lucide-react";
import { useNeuralControls } from "../hooks/useNeuralControls";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Accept optional callbacks to open overlay panels from parent
const DashboardPanel = ({
  onOpenNotifications,
  onOpenQuickSettings,
  onOpenVehicleControl,
  onOpenMinimalDashboard
}) => {
  const [systemStatus] = useState({ battery: 78, range: 456, connectivity: true, health: 97, cycles: 1247 });
  const [showBattery, setShowBattery] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const neuralRef = useRef({ active: false, animationSpeed: 1, brightness: 0.5 });
  const [loadingStatus, setLoadingStatus] = useState('Cargando 3D...');

  // Control neuronal: cuando está activo, sus salidas reemplazan los valores del dashboard.
  const { active: neuralActive, controls: neural } = useNeuralControls();

  // Mantener el ref sincronizado para el loop de animación 3D.
  useEffect(() => {
    neuralRef.current = {
      active: neuralActive,
      animationSpeed: neural.animationSpeed,
      brightness: neural.brightness,
    };
  }, [neuralActive, neural.animationSpeed, neural.brightness]);

  
  useEffect(() => {
    if (!mountRef.current) return;

    // Configurar escena Three.js
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060a0f);
    
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Iluminación
    const ambientLight = new THREE.AmbientLight(0x4ef3ff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0x7ff8ff, 1);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Crear vehículo básico si no hay GLB
    const vehicleGroup = new THREE.Group();
    
    // Cuerpo principal
    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4ef3ff,
      metalness: 0.1,
      roughness: 0.15,
      transmission: 0.85,
      thickness: 0.4,
      transparent: true,
      opacity: 0.35
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 1;
    vehicleGroup.add(body);

    // Ruedas
    const wheelGeometry = new THREE.TorusGeometry(0.5, 0.15, 12, 48);
    const wheelMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x4ef3ff,
      metalness: 0.2,
      roughness: 0.3,
      transparent: true,
      opacity: 0.8
    });
    
    const wheelPositions = [
      [-1.5, 0.5, 1], [-1.5, 0.5, -1],
      [1.5, 0.5, 1], [1.5, 0.5, -1]
    ];
    
    wheelPositions.forEach(pos => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos[0], pos[1], pos[2]);
      wheel.rotation.z = Math.PI / 2;
      vehicleGroup.add(wheel);
    });

    scene.add(vehicleGroup);
    camera.position.set(5, 3, 5);
    controls.target.set(0, 1, 0);

    setLoadingStatus('');

    // Animación
    const animate = () => {
      requestAnimationFrame(animate);
      const n = neuralRef.current;
      if (n.active) {
        vehicleGroup.rotation.y += 0.01 * (n.animationSpeed || 1);
        ambientLight.intensity = 0.3 + (n.brightness || 0.5);
      } else {
        ambientLight.intensity = 0.6;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    sceneRef.current = { scene, camera, renderer, controls };
    
    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const bottomOptions = [
    "Navegación", "Asiento", "Luces", "Ventanas", "Carga",
    "ISOFIX", "Seguridad", "Conexión", "Notificaciones",
    "Voz", "Pantalla", "Personalización"
  ];

  const autonomyKm = Math.round(systemStatus.battery * 7.5);

  // Valores mostrados: neuronales si la red está activa, si no los de demo.
  const speed = neuralActive ? Math.round(neural.speed) : 85;
  const rpm = neuralActive ? Math.round(neural.rpm) : 2850;
  const torque = neuralActive ? Math.round(neural.torque) : 420;
  const temp = neuralActive ? Math.round(neural.temperature) : 32;
  const battery = neuralActive ? Math.round(neural.battery) : systemStatus.battery;

  return (
    <div className="flex flex-col h-full">
      {/* Header con accesos directos a paneles */}
      <div className="h-12 sm:h-14 bg-gray-900 flex items-center justify-between px-4 sm:px-6 rounded-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-sm sm:text-base font-bold text-white">BMW Style</span>
          <Badge className="bg-blue-600 text-xs">Dashboard</Badge>
          {neuralActive && (
            <Badge className="bg-emerald-500 text-xs animate-pulse" data-testid="neural-active-badge">Neural ON</Badge>
          )}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 text-white">
          {/* Velocidad */}
          <div className="flex items-center gap-1 text-cyan-400">
            <Gauge className="w-4 h-4" />
            <span className="font-bold" data-testid="header-speed">{speed} km/h</span>
          </div>
          {/* RPM */}
          <div className="flex items-center gap-1 text-green-400">
            <span className="text-xs">RPM</span>
            <span className="font-bold" data-testid="header-rpm">{rpm.toLocaleString()}</span>
          </div>
          {/* Torque */}
          <div className="flex items-center gap-1 text-orange-400">
            <span className="text-xs">Torque</span>
            <span className="font-bold" data-testid="header-torque">{torque} Nm</span>
          </div>
          {/* Temperatura */}
          <div className="flex items-center gap-1 text-red-400">
            <Thermometer className="w-4 h-4" />
            <span className="font-bold" data-testid="header-temp">{temp}°C</span>
          </div>
          {/* Batería */}
          <div className="flex items-center gap-1 text-green-400">
            <Battery className="w-4 h-4" />
            <span className="font-bold" data-testid="header-battery">{battery}%</span>
          </div>
          <Wifi size={14} />
          <Bluetooth size={14} />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col sm:flex-row gap-4 py-4">
        {/* Vehicle 3D */}
        <div className="flex-1 flex items-center justify-center p-0 sm:p-2 min-h-[360px]">
          <div className="relative w-full h-[380px] sm:h-[460px] rounded-md overflow-hidden border border-slate-800">
            <div ref={mountRef} className="w-full h-full" />
            {loadingStatus && (
              <div className="absolute inset-0 flex items-center justify-center text-cyan-200/80 text-xs bg-black/20 pointer-events-none">
                {loadingStatus}
              </div>
            )}
          </div>
        </div>

        {/* Status cards */}
        <div className="w-full sm:w-80 space-y-3">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">Velocidad</Badge>
              </div>
              <div className="text-2xl font-bold text-cyan-400 mb-1" data-testid="card-speed">{speed} km/h</div>
              <Progress value={Math.min(100, speed / 2)} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Battery className="w-5 h-5 text-green-400" />
                <Badge variant="outline" className="text-green-400 border-green-400">Batería</Badge>
              </div>
              <div className="text-2xl font-bold text-green-400 mb-1" data-testid="card-battery">{battery}%</div>
              <Progress value={battery} className="h-2" />
            </CardContent>
          </Card>
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Thermometer className="w-5 h-5 text-orange-400" />
                <Badge variant="outline" className="text-orange-400 border-orange-400">Temperatura</Badge>
              </div>
              <div className="text-2xl font-bold text-orange-400 mb-1" data-testid="card-temp">{temp}°C</div>
              <Progress value={Math.min(100, temp * 2)} className="h-2" />
            </CardContent>
          </Card>
          
          {/* Sistemas de Control */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="p-4">
              <div className="mb-3">
                <Badge variant="outline" className="text-blue-400 border-blue-400">Sistemas</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {/* Botón Notificaciones */}
                <button
                  onClick={onOpenNotifications}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-md text-xs transition-colors"
                  title="Abrir Notificaciones"
                >
                  <Bell className="w-4 h-4" />
                  <span>Notifs</span>
                </button>
                
                {/* Botón Ajustes */}
                <button
                  onClick={onOpenQuickSettings}
                  className="flex items-center gap-2 px-3 py-2 bg-cyan-600/80 hover:bg-cyan-600 text-white rounded-md text-xs transition-colors"
                  title="Abrir Ajustes rápidos"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>Ajustes</span>
                </button>
                
                {/* Botón Control */}
                <button
                  onClick={onOpenVehicleControl}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-md text-xs transition-colors"
                  title="Abrir Control del Vehículo"
                >
                  <Car className="w-4 h-4" />
                  <span>Control</span>
                </button>
                
                {/* Botón Tablero */}
                <button
                  onClick={onOpenMinimalDashboard}
                  className="flex items-center gap-2 px-3 py-2 bg-purple-600/80 hover:bg-purple-600 text-white rounded-md text-xs transition-colors"
                  title="Abrir Tablero Minimal"
                >
                  <Gauge className="w-4 h-4" />
                  <span>Tablero</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom quick functions */}
      <div className="h-16 sm:h-20 bg-gray-900 border-t border-gray-700 px-2 sm:px-4 py-2 rounded-md">
        <div className="flex gap-1 sm:gap-2 overflow-x-auto">
          {["Navegación","Asiento","Luces","Ventanas","Carga","ISOFIX","Seguridad","Conexión","Notificaciones","Voz","Pantalla","Personalización"].map((option, i) => (
            <div key={i} className="shrink-0 flex flex-col items-center justify-center w-14 sm:w-16 h-10 sm:h-12 text-xs text-gray-300 bg-gray-800 rounded">
              <span className="text-[10px] leading-none">{option.split(" ")[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;