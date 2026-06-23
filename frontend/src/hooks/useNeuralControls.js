import { useContext } from "react";
import { NeuronsContext } from "../components/NeuronsSystem";

// Valores neutros por defecto (cuando la red neuronal está inactiva).
const DEFAULT_CONTROLS = {
  speed: 0,
  temperature: 0,
  battery: 0,
  rpm: 0,
  torque: 0,
  brightness: 0.5,
  panelOpacity: 0.8,
  animationSpeed: 1,
};

// Lee el estado neuronal desde el NeuronsContext (vive en la raíz de la app),
// por lo que persiste aunque el panel NeuronsSystem se desmonte al navegar.
export function useNeuralControls() {
  const { neuronsActive, neuronsData } = useContext(NeuronsContext);
  return {
    active: Boolean(neuronsActive),
    controls: { ...DEFAULT_CONTROLS, ...(neuronsData?.controls || {}) },
  };
}
