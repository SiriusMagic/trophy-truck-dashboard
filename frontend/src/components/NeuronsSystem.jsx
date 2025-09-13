import React, { useState, useMemo, useContext, createContext } from "react";
import { motion } from "framer-motion";

// Context para compartir el estado de neuronas globalmente
export const NeuronsContext = createContext();

export const NeuronsProvider = ({ children }) => {
  const [neuronsActive, setNeuronsActive] = useState(false);
  const [neuronsData, setNeuronsData] = useState(null);
  
  return (
    <NeuronsContext.Provider value={{ 
      neuronsActive, 
      setNeuronsActive, 
      neuronsData, 
      setNeuronsData 
    }}>
      {children}
    </NeuronsContext.Provider>
  );
};

export default function NeuronsSystem() {
  // Slider value 0..100 para controlar toda la aplicación
  const [value, setValue] = useState(50);
  const [isActive, setIsActive] = useState(false);

  // Network shape - expandido para controlar más elementos
  const shape = { input: 1, hidden: 12, output: 8 };

  // Deterministic "random" weights for reproducibility
  const seededRandom = (seed) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  const initNetwork = useMemo(() => {
    const rand = seededRandom(12345);
    // weights: input->hidden
    const w1 = Array.from({ length: shape.hidden }, () => [{ w: (rand() * 2 - 1) * 1.0, name: "in->h" }]);
    // hidden biases
    const b1 = Array.from({ length: shape.hidden }, () => ({ b: (rand() * 2 - 1) * 0.5 }));
    // weights: hidden->output
    const w2 = Array.from({ length: shape.output }, () => 
      Array.from({ length: shape.hidden }, () => ({ w: (rand() * 2 - 1) * 1.0 }))
    );
    const b2 = Array.from({ length: shape.output }, () => ({ b: (rand() * 2 - 1) * 0.5 }));
    return { w1, b1, w2, b2 };
  }, []);

  const [network, setNetwork] = useState(initNetwork);
  const [snapshot, setSnapshot] = useState(null);

  // normalize slider 0..100 -> 0..1
  const normalized = value / 100;

  // simple activation function (sigmoid)
  const sigmoid = (x) => 1 / (1 + Math.exp(-x));

  // forward pass
  const forward = (inValue, net) => {
    // input->hidden
    const hidden = net.w1.map((wObj, i) => {
      const w = wObj[0].w;
      const z = inValue * w + net.b1[i].b;
      return { z, a: sigmoid(z) };
    });

    // hidden->output
    const output = net.w2.map((row, j) => {
      let z = net.b2[j].b;
      for (let i = 0; i < row.length; i++) z += row[i].w * hidden[i].a;
      return { z, a: sigmoid(z) };
    });

    return { hidden, output };
  };

  const ff = forward(normalized, network);

  // Funciones para aplicar control neuronal a la aplicación
  const applyNeuralControl = () => {
    if (!isActive) return;

    // Emitir evento personalizado con datos neuronales
    window.dispatchEvent(new CustomEvent('neuronsUpdate', {
      detail: {
        input: normalized,
        hidden: ff.hidden.map(h => h.a),
        output: ff.output.map(o => o.a),
        controls: {
          speed: ff.output[0]?.a * 100 || 0,
          temperature: ff.output[1]?.a * 50 || 0,
          battery: ff.output[2]?.a * 100 || 0,
          rpm: ff.output[3]?.a * 3000 || 0,
          torque: ff.output[4]?.a * 500 || 0,
          brightness: ff.output[5]?.a || 0.5,
          panelOpacity: ff.output[6]?.a || 0.8,
          animationSpeed: ff.output[7]?.a * 2 || 1
        }
      }
    }));
  };

  React.useEffect(() => {
    applyNeuralControl();
  }, [ff, isActive]);

  const convertToNeurons = () => {
    const neurons = [];
    // input neuron
    neurons.push({ id: "in_0", type: "input", activation: normalized });

    // hidden
    ff.hidden.forEach((h, i) => {
      neurons.push({
        id: `h_${i}`,
        type: "hidden",
        bias: network.b1[i].b,
        weights_from: [{ from: "in_0", w: network.w1[i][0].w }],
        activation: h.a,
      });
    });

    // output
    ff.output.forEach((o, j) => {
      const weights = network.w2[j].map((cell, i) => ({ from: `h_${i}`, w: cell.w }));
      neurons.push({
        id: `out_${j}`,
        type: "output",
        bias: network.b2[j].b,
        weights_from: weights,
        activation: o.a
      });
    });

    setSnapshot({ neurons, timestamp: Date.now() });
  };

  const exportJSON = () => {
    const data = snapshot ?? { neurons: [{ id: "in_0", type: "input", activation: normalized }] };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trophy_truck_neurons.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const tweakBias = (layer, idx, delta) => {
    setNetwork((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (layer === "hidden") copy.b1[idx].b = +(copy.b1[idx].b + delta).toFixed(4);
      if (layer === "output") copy.b2[idx].b = +(copy.b2[idx].b + delta).toFixed(4);
      return copy;
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Sistema Neural - Control Total</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsActive(!isActive)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              isActive 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-slate-600 hover:bg-slate-700 text-white'
            }`}
          >
            {isActive ? 'ACTIVO' : 'INACTIVO'}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/60 p-4 rounded-lg mb-6">
        <label className="block text-sm text-slate-300 mb-2">
          Control Master: <span className="font-semibold text-cyan-400">{value}</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full accent-cyan-400"
        />
        <div className="flex items-center gap-4 mt-3">
          <div className="text-xs text-slate-400">Señal: {normalized.toFixed(3)}</div>
          <button
            className="ml-auto bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1 rounded"
            onClick={convertToNeurons}
          >
            Snapshot Neural
          </button>
          <button
            className="bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 rounded"
            onClick={exportJSON}
          >
            Exportar Red
          </button>
        </div>
      </div>

      {/* Control Output Display */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/40 p-3 rounded">
          <div className="text-xs text-slate-400 mb-1">Velocidad</div>
          <div className="text-lg font-bold text-cyan-400">
            {(ff.output[0]?.a * 100 || 0).toFixed(0)} km/h
          </div>
        </div>
        <div className="bg-slate-900/40 p-3 rounded">
          <div className="text-xs text-slate-400 mb-1">RPM</div>
          <div className="text-lg font-bold text-green-400">
            {(ff.output[3]?.a * 3000 || 0).toFixed(0)}
          </div>
        </div>
        <div className="bg-slate-900/40 p-3 rounded">
          <div className="text-xs text-slate-400 mb-1">Torque</div>
          <div className="text-lg font-bold text-orange-400">
            {(ff.output[4]?.a * 500 || 0).toFixed(0)} Nm
          </div>
        </div>
        <div className="bg-slate-900/40 p-3 rounded">
          <div className="text-xs text-slate-400 mb-1">Batería Neural</div>
          <div className="text-lg font-bold text-green-400">
            {(ff.output[2]?.a * 100 || 0).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Input column */}
        <div className="bg-slate-900/40 p-4 rounded">
          <h3 className="font-medium mb-3 text-cyan-400">Entrada</h3>
          <div className="flex items-center gap-3">
            <motion.div
              className="w-16 h-16 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold"
              animate={{ scale: 1 + normalized * 0.8 }}
            >
              {normalized.toFixed(2)}
            </motion.div>
            <div className="text-sm text-slate-300">Sensor Principal</div>
          </div>
        </div>

        {/* Hidden column */}
        <div className="bg-slate-900/40 p-4 rounded">
          <h3 className="font-medium mb-3 text-indigo-400">Procesamiento ({shape.hidden})</h3>
          <div className="grid grid-cols-4 gap-2">
            {ff.hidden.map((h, i) => (
              <div key={i} className="p-2 bg-slate-800/30 rounded text-center">
                <motion.div
                  className="w-10 h-10 rounded-full bg-indigo-400 mx-auto flex items-center justify-center font-semibold text-black text-xs"
                  animate={{ scale: 0.7 + h.a * 1.0 }}
                >
                  {h.a.toFixed(1)}
                </motion.div>
                <div className="text-xs mt-1 text-slate-300">N{i}</div>
                <div className="text-xs text-slate-400">b:{network.b1[i].b.toFixed(2)}</div>
                <div className="flex gap-1 justify-center mt-1">
                  <button
                    className="text-xs px-1 bg-slate-700 rounded hover:bg-slate-600"
                    onClick={() => tweakBias("hidden", i, 0.05)}
                  >+</button>
                  <button
                    className="text-xs px-1 bg-slate-700 rounded hover:bg-slate-600"
                    onClick={() => tweakBias("hidden", i, -0.05)}
                  >-</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Output column */}
        <div className="bg-slate-900/40 p-4 rounded">
          <h3 className="font-medium mb-3 text-emerald-400">Controles ({shape.output})</h3>
          <div className="space-y-2">
            {ff.output.map((o, j) => {
              const labels = ['Vel', 'Temp', 'Bat', 'RPM', 'Torq', 'Luz', 'Panel', 'Anim'];
              return (
                <div key={j} className="p-2 bg-slate-800/30 rounded flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center font-semibold text-black text-xs"
                      animate={{ scale: 0.8 + o.a * 1.0 }}
                    >
                      {o.a.toFixed(1)}
                    </motion.div>
                    <div className="text-xs text-slate-300">{labels[j]}</div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      className="text-xs px-1 bg-slate-700 rounded hover:bg-slate-600"
                      onClick={() => tweakBias("output", j, 0.05)}
                    >+</button>
                    <button
                      className="text-xs px-1 bg-slate-700 rounded hover:bg-slate-600"
                      onClick={() => tweakBias("output", j, -0.05)}
                    >-</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snapshot viewer */}
      {snapshot && (
        <div className="mt-6 bg-slate-800/50 p-4 rounded">
          <h4 className="font-medium mb-2 text-cyan-400">Red Neural Exportable</h4>
          <div className="text-xs text-slate-400 mb-2">
            Generado: {new Date(snapshot.timestamp).toLocaleString()}
          </div>
          <pre className="bg-black/60 p-3 rounded text-xs overflow-auto max-h-48 text-slate-200">
            {JSON.stringify(snapshot.neurons.slice(0, 5), null, 2)}...
          </pre>
        </div>
      )}
    </div>
  );
}