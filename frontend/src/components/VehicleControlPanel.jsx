import React, { useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Gauge, Zap, ArrowBigDownDash, ChevronsUpDown } from "lucide-react";

// Panel deslizante desde abajo: Control del vehículo
// - Pedal único (velocidad/voltaje)
// - Palanca de torque (amperaje) con modos preestablecidos
// - Botón de Reversa (torque máximo, velocidad ajustable)

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const TORQUE_MODES = [
  { id: "eco", name: "Eficiente", amperage: 90 },
  { id: "norm", name: "Normal", amperage: 150 },
  { id: "sport", name: "Deportivo", amperage: 220 }
];

const VehicleControlPanel = ({ open, onClose, motorControls, setMotorControls, currentGear, setCurrentGear }) => {
  const mc = motorControls || { rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } };
  const [pedal, setPedal] = useState(50); // 0..100
  const [mode, setMode] = useState("norm");
  const [reverse, setReverse] = useState(currentGear === -1);

  // Mapear pedal -> voltaje: 200V..480V (ejemplo)
  const voltage = useMemo(() => Math.round(200 + (pedal / 100) * (480 - 200)), [pedal]);
  const modeCfg = useMemo(() => TORQUE_MODES.find(m => m.id === mode) || TORQUE_MODES[1], [mode]);

  const applyVoltage = (v) => {
    const val = clamp(v, 200, 480);
    setMotorControls?.(prev => ({
      ...(prev || mc),
      rear: { ...(prev?.rear || mc.rear), voltage: val },
      front: { ...(prev?.front || mc.front), voltage: val }
    }));
  };

  const applyAmperage = (amps) => {
    const a = clamp(amps, 60, 260);
    setMotorControls?.(prev => ({
      ...(prev || mc),
      rear: { ...(prev?.rear || mc.rear), amperage: a },
      front: { ...(prev?.front || mc.front), amperage: a - 10 }
    }));
  };

  const handlePedalChange = (valueArr) => {
    const v = valueArr?.[0] ?? 0; setPedal(v); applyVoltage(Math.round(200 + (v / 100) * 280));
  };

  const handleMode = (id) => {
    setMode(id);
    const cfg = TORQUE_MODES.find(m => m.id === id) || TORQUE_MODES[1];
    applyAmperage(cfg.amperage);
  };

  const toggleReverse = () => {
    const next = !reverse; setReverse(next);
    setCurrentGear?.(next ? -1 : 1);
    if (next) {
      // Torque máximo seguro en reversa
      applyAmperage(240);
    } else {
      applyAmperage(modeCfg.amperage);
    }
  };

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-slate-950/95 border-t border-slate-800 backdrop-blur-md transition-transform duration-300 ease-in-out ${open ? "translate-y-0" : "translate-y-full"}`}
      role="dialog"
      aria-hidden={!open}
    >
      <div className="w-full max-w-5xl mx-auto p-4">
        {/* Handle */}
        <div className="w-14 h-1.5 bg-slate-600 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-semibold text-white/90">Control del Vehículo</div>
          <Button variant="outline" size="sm" onClick={onClose} className="border-slate-700 text-slate-200 hover:bg-slate-800">
            Cerrar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Pedal único - Velocidad/Voltaje */}
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-cyan-300"><Gauge className="w-4 h-4" /><span className="text-sm">Pedal (Velocidad)</span></div>
                <Badge className="bg-cyan-600">{voltage} V</Badge>
              </div>
              <div className="py-3">
                <Slider value={[pedal]} onValueChange={handlePedalChange} min={0} max={100} step={1} />
              </div>
              <div className="text-xs text-slate-400">Arrastra para ajustar la velocidad. Mapea 0-100% → 200-480V</div>
            </CardContent>
          </Card>

          {/* Palanca de Torque - Amperaje con modos */}
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-yellow-300"><Zap className="w-4 h-4" /><span className="text-sm">Palanca de Torque</span></div>
                <Badge variant="outline" className="border-yellow-400 text-yellow-300">{modeCfg.name}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {TORQUE_MODES.map(m => (
                  <Button key={m.id} variant={mode === m.id ? "default" : "outline-solid"} onClick={() => handleMode(m.id)} className={`${mode === m.id ? 'bg-yellow-600 hover:bg-yellow-700' : 'border-slate-600'} text-xs`}>
                    {m.name}
                  </Button>
                ))}
              </div>
              <div className="text-xs text-slate-400">Cada modo define el amperaje límite del motor.</div>
            </CardContent>
          </Card>

          {/* Reversa controlada */}
          <Card className="bg-slate-900/60 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-purple-300"><ArrowBigDownDash className="w-4 h-4" /><span className="text-sm">Modo Reversa</span></div>
                <Badge variant="outline" className={`border-purple-400 ${reverse ? 'text-purple-300' : 'text-slate-400'}`}>{reverse ? 'Activo' : 'Inactivo'}</Badge>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <Button onClick={toggleReverse} className={`${reverse ? 'bg-purple-600 hover:bg-purple-700' : 'bg-slate-800 hover:bg-slate-700'} text-xs`}>{reverse ? 'Salir de Reversa' : 'Activar Reversa'}</Button>
                <div className="text-[11px] text-slate-400">Torque máximo disponible; velocidad ajustable con el pedal.</div>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500"><ChevronsUpDown className="w-3 h-3" /> Usa el pedal para modular la velocidad también en reversa.</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleControlPanel;