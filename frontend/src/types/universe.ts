export type PlanetCategory =
  | "Ideas"
  | "Thoughts"
  | "Notes"
  | "Projects"
  | "Goals";

export interface PlanetData {
  id: string;
  title: string;
  category: PlanetCategory;
  content: string;
  position: [number, number, number];
}

export interface PlanetConnection {
  id: string;
  sourceId: string;
  targetId: string;
}

export const PLANET_COLORS: Record<PlanetCategory, string> = {
  Ideas: "#a78bfa",
  Thoughts: "#5fe1d0",
  Notes: "#f3adcb",
  Projects: "#ff936d",
  Goals: "#f4ca79",
};

export const PLANET_CATEGORIES: PlanetCategory[] = [
  "Ideas",
  "Thoughts",
  "Notes",
  "Projects",
  "Goals",
];
