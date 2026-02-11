import { emptyRectDiagram } from "./empty-rect";
import type { Diagram } from "../render/types";

export const DIAGRAMS: Record<string, Diagram> = {
  "empty-rect": emptyRectDiagram
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
