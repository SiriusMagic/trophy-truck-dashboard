import { Battery, ChevronRight, Gauge, Thermometer, Zap } from "lucide-react";
import VehicleScene from "./VehicleScene";

function Metric({ icon: Icon, name, value, unit, tone, onClick, testId }) {
  return <button className={`instrument-metric ${tone || ""}`} onClick={onClick} aria-label={`Abrir ${name}`}><span><Icon aria-hidden="true" />{name}<ChevronRight aria-hidden="true" /></span><strong data-testid={testId}>{value}<small>{unit}</small></strong></button>;
}

export default function DashboardPanel({ vehicleData, currentGear, compact, simple, onOpenModule }) {
  const { speed, rpm, batteryLevel, batteryTemp, range, torque, powerConsumption } = vehicleData;
  return (
    <section className={`instrument-panel ${compact ? "compact" : ""} ${simple ? "simplified" : ""}`} aria-label="Tablero permanente" data-testid="dashboard-panel">
      <header className="instrument-heading"><span><i /> TABLERO</span><button className="gear-badge" aria-label="Abrir transmisión" onClick={() => onOpenModule("transmission")}><small>MARCHA</small><strong data-testid="current-gear">{currentGear === -1 ? "R" : currentGear}</strong></button></header>
      <div className="instrument-visual">
        <div className="speedometer">
          <svg className="speedometer-ring" viewBox="0 0 280 230" aria-hidden="true">
            <path d="M 34 198 A 124 124 0 1 1 246 198" className="speedometer-track" />
            <path d="M 34 198 A 124 124 0 1 1 246 198" className="speedometer-fill" pathLength="220" strokeDasharray={`${Math.min(220, speed)} 220`} />
            {Array.from({ length: 29 }, (_, index) => <line key={index} x1="140" y1="22" x2="140" y2={index % 4 ? "27" : "34"} transform={`rotate(${-125 + index * 250 / 28} 140 132)`} className="speedometer-tick" />)}
          </svg>
          <span className="speed-label">VELOCIDAD</span><strong className="speed-value" data-testid="card-speed">{speed}</strong><span className="speed-unit">km/h</span>
          <div className="drive-readings"><span><small>RPM</small><b>{rpm.toLocaleString("es")}</b></span><span><small>TORQUE</small><b>{torque} <em>Nm</em></b></span></div>
        </div>
        <div className="vehicle-visual"><VehicleScene /><div className="vehicle-caption"><span>TRACCIÓN ELÉCTRICA</span><button onClick={() => onOpenModule("power")}><Zap size={14} />{powerConsumption.toFixed(1)} kW<ChevronRight size={14} /></button></div></div>
      </div>
      <div className="instrument-metrics">
        <Metric icon={Battery} name="Batería" value={batteryLevel} unit="%" tone="green" testId="card-battery" onClick={() => onOpenModule("autonomy")} />
        <Metric icon={Thermometer} name="Temperatura" value={batteryTemp.toFixed(1)} unit="°C" tone="amber" testId="card-temp" onClick={() => onOpenModule("monitoring")} />
        <Metric icon={Gauge} name="Autonomía" value={range} unit="km" testId="card-range" onClick={() => onOpenModule("autonomy")} />
      </div>
      <div className="instrument-hint">Selecciona un sistema en la barra inferior</div>
    </section>
  );
}
