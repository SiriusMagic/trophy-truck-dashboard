import React, { useState } from "react";
import { Wifi, Camera, MonitorUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "../hooks/use-toast";

const QuickSettingsPanel = ({ open, onClose }) => {
  const { toast } = useToast();
  const [wifiOn, setWifiOn] = useState(true);
  const [sharing, setSharing] = useState(false);

  const takeScreenshot = () => {
    toast({ title: "Captura de pantalla", description: "Imagen guardada en la galería (sim)." });
  };

  const toggleShare = async () => {
    if (sharing) {
      setSharing(false);
      toast({ title: "Compartir pantalla", description: "Transmisión detenida (sim)." });
      return;
    }
    try {
      // Intento real si está disponible (requerirá permiso del navegador)
      if (navigator.mediaDevices?.getDisplayMedia) {
        await navigator.mediaDevices.getDisplayMedia({ video: true });
      }
      setSharing(true);
      toast({ title: "Compartir pantalla", description: "Transmitiendo (si el navegador lo permite)." });
    } catch (e) {
      toast({ title: "Compartir pantalla", description: "Permiso denegado o no soportado.", variant: "destructive" });
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 z-40 w-80 max-w-[85vw] bg-slate-900/95 border-l border-slate-800 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="text-sm font-semibold">Ajustes rápidos</div>
        <button aria-label="Cerrar" onClick={onClose} className="p-1 rounded hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between bg-slate-800/60 rounded-md px-3 py-2">
          <div className="flex items-center gap-2">
            <Wifi className={`w-5 h-5 ${wifiOn ? "text-cyan-400" : "text-slate-500"}`} />
            <div className="text-sm">Wi‑Fi</div>
          </div>
          <label className="inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only" checked={wifiOn} onChange={() => setWifiOn(v => !v)} />
            <div className={`w-10 h-5 rounded-full transition ${wifiOn ? "bg-cyan-500" : "bg-slate-600"}`}>
              <div className={`h-5 w-5 bg-white rounded-full shadow -mt-0.5 transition ${wifiOn ? "translate-x-5" : "translate-x-0"}`}></div>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="bg-slate-800/60 border-slate-700" onClick={takeScreenshot}>
            <Camera className="w-4 h-4 mr-2" /> Captura
          </Button>
          <Button variant="outline" className="bg-slate-800/60 border-slate-700" onClick={toggleShare}>
            <MonitorUp className="w-4 h-4 mr-2" /> {sharing ? "Detener" : "Compartir"}
          </Button>
        </div>

        <div className="text-xs text-slate-400">Desliza hacia la derecha para volver a Notificaciones</div>
      </div>
    </div>
  );
};

export default QuickSettingsPanel;