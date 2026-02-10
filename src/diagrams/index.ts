import { emptyRectDiagram } from "./empty-rect";
import { medianPartitionDiagram } from "./median-partition";
import type { Diagram } from "../render/types";

export const DIAGRAMS: Record<string, Diagram> = {
  "empty-rect": emptyRectDiagram,
  "median-partition": medianPartitionDiagram
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
