export const AETHERA_THEME = {
  background: "#080713",

  colors: {
    void: "#080713",
    deepSpace: "#100b23",
    violet: "#a78bfa",
    lavender: "#c4a5ff",
    cyan: "#5fe1d0",
    rose: "#f3adcb",
    coral: "#ff936d",
    gold: "#f4ca79",
    starlight: "#f5f1ff",
  },

  atmosphere: {
    ambientIntensity: 0.65,
    starCount: 3500,
    starRadius: 90,
    starDepth: 50,
  },

  motion: {
    planetRotationSpeed: 0.12,
    orbitalRotationSpeed: 0.06,
    cameraEase: 2.5,
    floatingSpeed: 1.2,
  },

  quality: {
    minimumPixelRatio: 1,
    maximumPixelRatio: 1.75,
    particleBudget: 2000,
  },
} as const;

export type AetheraTheme = typeof AETHERA_THEME;
