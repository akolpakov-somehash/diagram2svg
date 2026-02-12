import { emptyRectDiagram } from "./empty-rect";
import { arrFilled, arr10Diagram, arrTxtDiagram, arrayRectDiagram } from "./array";
import type { Diagram } from "../render/types";
import { p1SampleMergedArr } from "./post-1";
import { twoArraysSampleDiagram} from "./two-arrays-sample";

export const DIAGRAMS: Record<string, Diagram> = {
  "empty-rect": emptyRectDiagram,
  "array": arrayRectDiagram,
  "array-10": arr10Diagram,
  "array-txt": arrTxtDiagram,
  "arrays-2": twoArraysSampleDiagram,
  "array-filled": arrFilled,
  //post-1
  "p1-sample-merged": p1SampleMergedArr,
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
