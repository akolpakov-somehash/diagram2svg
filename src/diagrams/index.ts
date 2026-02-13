import { emptyRectDiagram } from "./empty-rect";
import { arrFilled, arr10Diagram, arrTxtDiagram, arrayRectDiagram } from "./array";
import type { Diagram } from "../render/types";
import { p1MedianEven, p1MedianOdd, p1SampleMergedArr, p1SimpleMerge } from "./post-1";
import { twoArraysSampleDiagram} from "./two-arrays-sample";
import { sampleArrow } from "./symbols";

export const DIAGRAMS: Record<string, Diagram> = {
  //sameples
  "empty-rect": emptyRectDiagram,
  "array": arrayRectDiagram,
  "array-10": arr10Diagram,
  "array-txt": arrTxtDiagram,
  "arrays-2": twoArraysSampleDiagram,
  "array-filled": arrFilled,
  "sample-arrow": sampleArrow,
  //post-1
  "p1-sample-merged": p1SampleMergedArr,
  "p1-median-odd": p1MedianOdd,
  "p1-median-even": p1MedianEven,
  "p1-simple-merge": p1SimpleMerge,
};

export function listDiagrams(): string[] {
  return Object.keys(DIAGRAMS).sort();
}

export function getDiagram(name: string): Diagram | undefined {
  return DIAGRAMS[name];
}
