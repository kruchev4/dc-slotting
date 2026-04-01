export const DEFAULT_MODEL = {
  meta: {
    name: "Forward Pick — Prototype",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    units: "grid",
  },
  grid: {
    cols: 48,
    rows: 28,
    cellSize: 18,
    showCoordinates: false,
    snapToGrid: true,
  },
  pickPoints: [],
  zones: [],
  locations: [],
  rules: {
    clearanceFactor: 0.92,
    defaultMaxWeightLb: 60,
  },
} as const;
