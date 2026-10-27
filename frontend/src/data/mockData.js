import { Mountain, Car, Target, Zap } from 'lucide-react';

export const mockData = {
  speed: 85, // km/h
  batteryLevel: 78, // percentage
  batteryTemp: 32.5, // celsius
  torque: 280, // Nm
  powerConsumption: 45, // kW
  range: 342, // km
  efficiency: 4.2, // km/kWh
  odometer: 12847, // km recorridos total
  tripMeter: 156.3, // km del viaje actual
  gForce: {
    x: 0.2, // lateral
    y: -0.1, // longitudinal  
    z: 0.05 // vertical
  },
  pitch: 5.2, // degrees
  roll: -2.1, // degrees
  tirePressure: {
    fl: 32.1, // front left PSI
    fr: 31.8, // front right PSI
    rl: 33.2, // rear left PSI
    rr: 32.9  // rear right PSI
  },
  motorHealth: {
    front: {
      temperature: 45.2,
      efficiency: 94.5,
      bearingHealth: 98.2
    },
    rear: {
      temperature: 48.7,
      efficiency: 96.1,
      bearingHealth: 95.8
    }
  },
  batteryPack: {
    cellTemp: [31.2, 32.1, 31.8, 32.5],
    voltage: 402.1,
    cycleCount: 1247,
    health: 97.3
  }
};

export const presetConfigs = [
  {
    name: "Eco Mode",
    driveMode: "FWD",
    powerDistribution: [20, 80],
    motorControls: {
      rear: { voltage: 300, amperage: 100 },
      front: { voltage: 320, amperage: 120 }
    }
  },
  {
    name: "Sport Mode",
    driveMode: "AWD", 
    powerDistribution: [70, 30],
    motorControls: {
      rear: { voltage: 550, amperage: 250 },
      front: { voltage: 450, amperage: 180 }
    }
  },
  {
    name: "Track Mode",
    driveMode: "RWD",
    powerDistribution: [100, 0],
    motorControls: {
      rear: { voltage: 600, amperage: 300 },
      front: { voltage: 200, amperage: 50 }
    }
  },
  {
    name: "Snow Mode",
    driveMode: "AWD",
    powerDistribution: [40, 60], 
    motorControls: {
      rear: { voltage: 350, amperage: 130 },
      front: { voltage: 380, amperage: 150 }
    }
  }
];

export const suspensionModes = [
  {
    name: "Rock Crawling",
    icon: Mountain,
    height: 85,
    stiffness: { front: 25, rear: 30 },
    description: "Suspensión suave y altura máxima para máxima articulación"
  },
  {
    name: "Baja",
    icon: Zap,
    height: 60,
    stiffness: { front: 80, rear: 85 },
    description: "Suspensión rígida optimizada para impactos de alta velocidad"
  },
  {
    name: "Asfalto",
    icon: Car,
    height: 25,
    stiffness: { front: 70, rear: 75 },
    description: "Chasis bajo y suspensión deportiva para carretera"
  },
  {
    name: "Manual",
    icon: Target,
    height: 50,
    stiffness: { front: 50, rear: 50 },
    description: "Control manual completo de todos los parámetros"
  }
];

export const driveProfiles = [
  {
    name: "Rampage",
    description: "Máxima potencia y agresividad",
    driveMode: "AWD",
    powerDistribution: [75, 25],
    motorControls: {
      rear: { voltage: 580, amperage: 280 },
      front: { voltage: 520, amperage: 200 }
    }
  },
  {
    name: "Ghost",
    description: "Modo silencioso y eficiente",
    driveMode: "FWD",
    powerDistribution: [10, 90],
    motorControls: {
      rear: { voltage: 250, amperage: 80 },
      front: { voltage: 300, amperage: 100 }
    }
  },
  {
    name: "Normal",
    description: "Configuración equilibrada estándar",
    driveMode: "AWD",
    powerDistribution: [60, 40],
    motorControls: {
      rear: { voltage: 400, amperage: 150 },
      front: { voltage: 380, amperage: 120 }
    }
  }
];

export const virtualGears = [
  {
    gear: 1,
    name: "Torque Máximo",
    description: "Ideal para arranque y ascensos",
    voltageRange: [200, 350],
    amperageRange: [150, 300],
    defaultSettings: {
      rear: { voltage: 280, amperage: 250 },
      front: { voltage: 260, amperage: 200 }
    }
  },
  {
    gear: 2,
    name: "Equilibrado",
    description: "Uso general off-road",
    voltageRange: [300, 450],
    amperageRange: [100, 200],
    defaultSettings: {
      rear: { voltage: 400, amperage: 150 },
      front: { voltage: 380, amperage: 120 }
    }
  },
  {
    gear: 3,
    name: "Velocidad Máxima",
    description: "Para terrenos planos y alta velocidad",
    voltageRange: [400, 600],
    amperageRange: [50, 150],
    defaultSettings: {
      rear: { voltage: 580, amperage: 100 },
      front: { voltage: 550, amperage: 80 }
    }
  },
  {
    gear: -1,
    name: "Reversa Torque",
    description: "Máximo torque en reversa",
    voltageRange: [200, 400],
    amperageRange: [100, 250],
    defaultSettings: {
      rear: { voltage: 300, amperage: 200 },
      front: { voltage: 280, amperage: 180 }
    }
  }
];