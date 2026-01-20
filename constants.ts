
import { LevelConfig } from './types';

export const GRAVITY = 0.8;
export const JUMP_FORCE = -16;
export const MOVE_SPEED = 6;
export const FRICTION = 0.85;
export const MAX_HEALTH = 100;
export const WORLD_HEIGHT = 600;

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "La Cocina",
    description: "¡Cuidado con los cuchillos y el fuego!",
    theme: "kitchen",
    background: "linear-gradient(to bottom, #ff9a9e, #fad0c4)",
    width: 3000,
    platforms: [
      { x: 0, y: 550, width: 600, height: 50 },
      { x: 700, y: 450, width: 200, height: 30 },
      { x: 1000, y: 350, width: 300, height: 30 },
      { x: 1400, y: 450, width: 200, height: 30 },
      { x: 1700, y: 300, width: 400, height: 30 },
      { x: 2200, y: 450, width: 300, height: 30 },
      { x: 2600, y: 550, width: 400, height: 50 },
    ],
    obstacles: [
      { x: 800, y: 560, width: 50, height: 40, damage: 20, label: "🔥" },
      { x: 1100, y: 310, width: 40, height: 40, damage: 15, label: "🔪" },
      { x: 1800, y: 260, width: 40, height: 40, damage: 15, label: "🔪" },
      { x: 2300, y: 410, width: 50, height: 40, damage: 25, label: "🧯" },
    ],
    goal: { x: 2800, y: 450, width: 60, height: 100 }
  },
  {
    id: 2,
    name: "El Baño",
    description: "¡Pisos resbalosos y burbujas por doquier!",
    theme: "bathroom",
    background: "linear-gradient(to bottom, #a1c4fd, #c2e9fb)",
    width: 3000,
    platforms: [
      { x: 0, y: 550, width: 500, height: 50 },
      { x: 600, y: 400, width: 250, height: 30, type: 'slippery' },
      { x: 950, y: 300, width: 200, height: 30 },
      { x: 1250, y: 450, width: 300, height: 30, type: 'slippery' },
      { x: 1650, y: 350, width: 250, height: 30 },
      { x: 2000, y: 450, width: 200, height: 30 },
      { x: 2400, y: 550, width: 600, height: 50 },
    ],
    obstacles: [
      { x: 700, y: 360, width: 40, height: 40, damage: 10, label: "🧼" },
      { x: 1000, y: 260, width: 40, height: 40, damage: 10, label: "🧼" },
      { x: 1400, y: 410, width: 60, height: 60, damage: 15, label: "🫧" },
      { x: 1750, y: 310, width: 60, height: 60, damage: 15, label: "🫧" },
    ],
    goal: { x: 2850, y: 450, width: 60, height: 100 }
  },
  {
    id: 3,
    name: "El Dormitorio",
    description: "¡Cuidado con las almohadas voladoras!",
    theme: "bedroom",
    background: "linear-gradient(to bottom, #667eea, #764ba2)",
    width: 3500,
    platforms: [
      { x: 0, y: 550, width: 400, height: 50 },
      { x: 500, y: 400, width: 300, height: 40 },
      { x: 900, y: 300, width: 300, height: 40, type: 'bouncy' },
      { x: 1300, y: 450, width: 300, height: 40 },
      { x: 1700, y: 350, width: 400, height: 40, type: 'bouncy' },
      { x: 2200, y: 450, width: 300, height: 40 },
      { x: 2700, y: 300, width: 300, height: 40 },
      { x: 3100, y: 550, width: 400, height: 50 },
    ],
    obstacles: [
      { x: 600, y: 350, width: 50, height: 50, damage: 15, label: "🧸" },
      { x: 1400, y: 400, width: 50, height: 50, damage: 15, label: "☁️" },
      { x: 2300, y: 400, width: 50, height: 50, damage: 15, label: "☁️" },
      { x: 2800, y: 250, width: 50, height: 50, damage: 15, label: "🧸" },
    ],
    goal: { x: 3350, y: 450, width: 60, height: 100 }
  },
  {
    id: 4,
    name: "La Sala",
    description: "Esquiva los juguetes y salta sobre los muebles.",
    theme: "livingroom",
    background: "linear-gradient(to bottom, #f6d365, #fda085)",
    width: 3500,
    platforms: [
      { x: 0, y: 550, width: 400, height: 50 },
      { x: 500, y: 450, width: 400, height: 30 },
      { x: 1000, y: 350, width: 400, height: 30 },
      { x: 1500, y: 450, width: 400, height: 30 },
      { x: 2000, y: 350, width: 400, height: 30 },
      { x: 2500, y: 450, width: 400, height: 30 },
      { x: 3100, y: 550, width: 400, height: 50 },
    ],
    obstacles: [
      { x: 700, y: 400, width: 40, height: 40, damage: 20, label: "🕹️" },
      { x: 1200, y: 300, width: 40, height: 40, damage: 20, label: "🚂" },
      { x: 1700, y: 400, width: 40, height: 40, damage: 20, label: "🕹️" },
      { x: 2200, y: 300, width: 40, height: 40, damage: 20, label: "🚂" },
    ],
    goal: { x: 3300, y: 450, width: 60, height: 100 }
  },
  {
    id: 5,
    name: "El Jardín",
    description: "¡La meta final! Esquiva las rocas y llega al final.",
    theme: "garden",
    background: "linear-gradient(to bottom, #d4fc79, #96e6a1)",
    width: 4000,
    platforms: [
      { x: 0, y: 550, width: 500, height: 50 },
      { x: 600, y: 400, width: 300, height: 30 },
      { x: 1000, y: 300, width: 300, height: 30 },
      { x: 1400, y: 450, width: 300, height: 30 },
      { x: 1800, y: 350, width: 300, height: 30 },
      { x: 2200, y: 450, width: 300, height: 30 },
      { x: 2600, y: 300, width: 300, height: 30 },
      { x: 3000, y: 400, width: 300, height: 30 },
      { x: 3500, y: 550, width: 500, height: 50 },
    ],
    obstacles: [
      { x: 700, y: 350, width: 50, height: 50, damage: 30, label: "🪨" },
      { x: 1100, y: 250, width: 50, height: 50, damage: 30, label: "🌿" },
      { x: 1500, y: 400, width: 50, height: 50, damage: 30, label: "🪨" },
      { x: 1900, y: 300, width: 50, height: 50, damage: 30, label: "🌿" },
      { x: 2700, y: 250, width: 50, height: 50, damage: 30, label: "🪨" },
    ],
    goal: { x: 3800, y: 450, width: 60, height: 100 }
  }
];
