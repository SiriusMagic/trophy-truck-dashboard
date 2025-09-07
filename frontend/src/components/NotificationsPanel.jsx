import React from "react";
import { Bell, AlertTriangle, Usb, X } from "lucide-react";

const NotificationsPanel = ({ open, onClose, items = [] }) => {
  const defaultItems = items.length
    ? items
    : [
        { id: 1, type: "codigo", title: "Seguridad: Código P0420 activo", detail: "Eficiencia del catalizador por debajo del umbral (sim).", icon: AlertTriangle },
        { id: 2, type: "otg", title: "OTG conectado", detail: "Dispositivo USB reconocido (sim).", icon: Usb },
      ];

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-80 max-w-[85vw] bg-slate-900/95 border-r border-slate-800 transition-transform duration-300 ease-in-out ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-hidden={!open}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Bell className="w-4 h-4" /> Notificaciones
        </div>
        <button aria-label="Cerrar" onClick={onClose} className="p-1 rounded hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 space-y-2 overflow-y-auto h-[calc(100%-48px)]">
        {defaultItems.map((n) => {
          const Icon = n.icon || AlertTriangle;
          return (
            <div key={n.id} className="bg-slate-800/60 border border-slate-700 rounded-md p-3">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${n.type === 'codigo' ? 'text-yellow-400' : 'text-cyan-400'}`} />
                <div className="text-sm font-medium">{n.title}</div>
              </div>
              <div className="text-xs text-slate-400">{n.detail}</div>
            </div>
          );
        })}
      </div>
      <div className="px-3 py-2 text-[11px] text-slate-500 border-t border-slate-800">Desliza a la izquierda para ir a Ajustes rápidos</div>
    </div>
  );
};

export default NotificationsPanel;