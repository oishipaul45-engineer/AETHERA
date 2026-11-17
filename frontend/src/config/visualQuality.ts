export type VisualQuality = "low" | "medium" | "high";

export interface VisualQualitySettings {
  pixelRatio: number;
  particles: number;
  atmosphereLayers: number;
  enableBloom: boolean;
  enableAdvancedShaders: boolean;
}

export const VISUAL_QUALITY: Record<
  VisualQuality,
  VisualQualitySettings
> = {
  low: {
    pixelRatio: 1,
    particles: 250,
    atmosphereLayers: 1,
    enableBloom: false,
    enableAdvancedShaders: false,
  },

  medium: {
    pixelRatio: 1.25,
    particles: 900,
    atmosphereLayers: 2,
    enableBloom: true,
    enableAdvancedShaders: true,
  },

  high: {
    pixelRatio: 1.75,
    particles: 2000,
    atmosphereLayers: 3,
    enableBloom: true,
    enableAdvancedShaders: true,
  },
};

export const DEFAULT_VISUAL_QUALITY: VisualQuality = "high";
