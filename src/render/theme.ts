export interface Theme {
  stroke: string;
  strokeWidth: number;
  roughness: number;
  bowing: number;
  fill: string;
  fillStyle: string;
  fontFamily: string;
  fontSize: number;
}

export const DEFAULT_THEME: Theme = {
  stroke: "#000",
  strokeWidth: 4,
  roughness: 1.8,
  bowing: 1.2,
  fill: "transparent",
  fillStyle: "hachure",
  fontFamily: 'Virgil, "Comic Sans MS", system-ui, sans-serif',
  fontSize: 64
};
