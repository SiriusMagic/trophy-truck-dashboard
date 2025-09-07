import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Gauge, Zap, Activity, AlertTriangle, Battery, Car } from "lucide-react";

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const MinimalDriverDashboard = ({ currentGear = 2, motorControls, onExit }) => {
  const baseControls = useMemo(
    () => ({ rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } }),
    []
  );
  const mc = motorControls || baseControls;

  // Simulación simple si no hay telemetría real
  const [speed, setSpeed] = useState(86);
  const [rpm, setRpm] = useState(3200);
  const [torque, setTorque] = useState(
    clamp(Math.round(mc.rear.amperage * 1.2 + mc.front.amperage * 0.8), 50, 850)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setSpeed((s) => clamp(Math.round(s + (Math.random() - 0.5) * 4), 0, 220));
      const targetRpm = clamp(
        Math.round((speed * (currentGear + 1) * 120) + Math.random() * 150),
        800,
        7000
      );
      setRpm((r) => Math.round(r * 0.8 + targetRpm * 0.2));
      setTorque(
        clamp(
          Math.round(
            mc.rear.amperage * 1.2 + mc.front.amperage * 0.8 + (Math.random() - 0.5) * 10
          ),
          50,
          900
        )
      );
    }, 700);
    return () => clearInterval(id);
  }, [currentGear, mc.front.amperage, mc.rear.amperage, speed]);

  // Luces indicadoras (mock)
  const [indicators] = useState([
    { id: "abs", label: "ABS", color: "text-yellow-400", icon: Activity },
    { id: "engine", label: "Motor", color: "text-red-400", icon: AlertTriangle },
    { id: "battery", label: "Batería", color: "text-green-400", icon: Battery },
    { id: "traction", label: "Tracción", color: "text-cyan-400", icon: Car }
  ]);

  // Gesto: desde el borde derecho hacia el centro para salir (volver al dashboard)
  const startXRef = useRef(null);
  const EDGE_PX = 40; // zona sensible del borde derecho
  const THRESHOLD = 60; // distancia mínima hacia la izquierda para cerrar

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    const x = e.touches[0].clientX;
    const vw = window.innerWidth || document.documentElement.clientWidth || 0;
    // Solo si inicia cerca del borde derecho
    if (x >= vw - EDGE_PX) {
      startXRef.current = x;
    } else {
      startXRef.current = null;
    }
  };

  const handleTouchEnd = (e) => {
    if (startXRef.current == null) return;
    const endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startXRef.current;
    const deltaX = endX - startXRef.current; // será negativo si desliza hacia el centro
    if (deltaX < -THRESHOLD) {
      onExit?.();
    }
    startXRef.current = null;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="absolute top-3 right-3">
        <button
          onClick={onExit}
          className="bg-white/10 hover:bg-white/20 border border-white/20 rounded px-3 py-1 text-sm"
          aria-label="Salir del tablero minimalista"
        >
          <X className="inline w-4 h-4 mr-1" /> Salir
        </button>
      </div>

      {/* Contenido central */}
      <div className="h-full w-full flex flex-col items-center justify-center gap-6 p-4">
        {/* Velocidad grande */}
        <div className="text-center">
          <div className="text-6xl sm:text-7xl font-extrabold tracking-tight text-cyan-400">{speed}</div>
          <div className="text-sm uppercase tracking-widest text-cyan-300/80">km/h</div>
        </div>

        {/* Tres métricas: Torque / RPM / Gear */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-xl">
          <div className="text-center">
            <Zap className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
            <div className="text-xl font-bold text-yellow-400">{torque} Nm</div>
            <div className="text-[11px] text-white/60">Torque</div>
          </div>
          <div className="text-center">
            <Gauge className="w-6 h-6 mx-auto mb-1 text-purple-400" />
            <div className="text-xl font-bold text-purple-300">{rpm}</div>
            <div className="text-[11px] text-white/60">RPM</div>
          </div>
          <div className="text-center">
            <div className="w-6 h-6 mx-auto mb-1 rounded bg-white/10 flex items-center justify-center text-cyan-300">
              {currentGear > 0 ? currentGear : 'R'}
            </div>
            <div className="text-xl font-bold text-cyan-300">{currentGear > 0 ? `G${currentGear}` : 'Reversa'}</div>
            <div className="text-[11px] text-white/60">Marcha</div>
          </div>
        </div>

        {/* Indicadores */}
        <div className="flex items-center gap-4 mt-2">
          {indicators.map(({ id, label, color, icon: Icon }) => (
            <div key={id} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="text-[11px] text-white/70">{label}</span>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 text-center text-[10px] text-white/50">
          Desliza desde el borde derecho hacia el centro para volver al dashboard
        </div>
      </div>
    </div>
  );
};

export default MinimalDriverDashboard;