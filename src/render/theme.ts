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

const CLASSIC_THEME: Theme = {
  stroke: "#000",
  strokeWidth: 4,
  roughness: 1.8,
  bowing: 1.2,
  fill: "rgba(240, 96, 96, 0.28)",
  fillStyle: "hachure",
  fontFamily: 'Virgil, "Comic Sans MS", system-ui, sans-serif',
  fontSize: 64
};

const SYNTHWAVE_THEME: Theme = {
  stroke: "#ff4fd8",
  strokeWidth: 4,
  roughness: 1.3,
  bowing: 0.8,
  fill: "rgba(48, 240, 255, 0.3)",
  fillStyle: "zigzag",
  fontFamily: '"Orbitron", "Trebuchet MS", sans-serif',
  fontSize: 64
};

export const THEMES = {
  classic: CLASSIC_THEME,
  synthwave: SYNTHWAVE_THEME
} as const;

export type ThemeName = keyof typeof THEMES;

export const THEME_NAMES = Object.keys(THEMES) as ThemeName[];
export const DEFAULT_THEME_NAME: ThemeName = "classic";
export const DEFAULT_THEME: Theme = THEMES[DEFAULT_THEME_NAME];

export function parseThemeName(value: string): ThemeName | null {
  return (THEME_NAMES as readonly string[]).includes(value) ? (value as ThemeName) : null;
}

export function getThemeByName(name: ThemeName): Theme {
  return THEMES[name];
}
