import { useMemo, useState } from "react";
import { mockData } from "../data/mockData";

export function useVehicleState() {
  const [powerControlMode, setPowerControlMode] = useState("axle");
  const [powerDistribution, setPowerDistribution] = useState([60, 40]);
  const [motorControls, setMotorControls] = useState({ rear: { voltage: 400, amperage: 150 }, front: { voltage: 380, amperage: 120 } });
  const [individualMotorControls, setIndividualMotorControls] = useState({ rearLeft: { voltage: 400, amperage: 150 }, rearRight: { voltage: 400, amperage: 150 }, frontLeft: { voltage: 380, amperage: 120 }, frontRight: { voltage: 380, amperage: 120 } });
  const [aiPowerActive, setAiPowerActive] = useState(false);
  const [currentGear, setCurrentGear] = useState(2);
  const vehicleData = useMemo(() => {
    const motors = powerControlMode === "individual" ? Object.values(individualMotorControls) : Object.values(motorControls);
    return {
      ...mockData,
      powerConsumption: motors.reduce((total, motor) => total + motor.voltage * motor.amperage / 1000, 0),
      // Estimación de demo compartida por tablero y controles.
      torque: Math.round(motors.reduce((total, motor) => total + motor.amperage, 0) * 1.02),
    };
  }, [motorControls, individualMotorControls, powerControlMode]);

  return {
    vehicleData, powerControlMode, setPowerControlMode, powerDistribution, setPowerDistribution,
    motorControls, setMotorControls, individualMotorControls, setIndividualMotorControls,
    aiPowerActive, setAiPowerActive: () => setAiPowerActive((active) => !active), currentGear, setCurrentGear,
  };
}
