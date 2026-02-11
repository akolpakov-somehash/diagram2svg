import { emptyRectDiagram } from "./empty-rect";
import { arr10Diagram, arrayRectDiagram } from "./array";
import type { Diagram } from "../render/types";

export const DIAGRAMS: Record<string, Diagram> = {
  "empty-rect": emptyRectDiagram,
  "array": arrayRectDiagram,
  "array-10": arr10Diagram
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
