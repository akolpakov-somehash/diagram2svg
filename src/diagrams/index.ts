import { emptyRectDiagram } from "./empty-rect";
import { arr10Diagram, arrTxtDiagram, arrayRectDiagram } from "./array";
import type { Diagram } from "../render/types";
import { p1SampleMergedArr } from "./post-1";

export const DIAGRAMS: Record<string, Diagram> = {
  "empty-rect": emptyRectDiagram,
  "array": arrayRectDiagram,
  "array-10": arr10Diagram,
  "array-txt": arrTxtDiagram,
  //post-1
  "p1-sample-merged": p1SampleMergedArr,
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
