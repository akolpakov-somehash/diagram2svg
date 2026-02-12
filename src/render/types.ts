import type { Theme } from "./theme";

export interface ShapeStyle
  extends Partial<Pick<Theme, "stroke" | "strokeWidth" | "roughness" | "bowing" | "fill" | "fillStyle">> {
  opacity?: number;
}

export interface TextStyle {
  fill?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  anchor?: "start" | "middle" | "end";
  textAnchor?: "start" | "middle" | "end";
  dominantBaseline?:
    | "auto"
    | "middle"
    | "hanging"
    | "alphabetic"
    | "central"
    | "text-before-edge"
    | "text-after-edge";
}

export interface DrawingContext {
  rect(x: number, y: number, width: number, height: number, opts?: ShapeStyle): void;
  line(x1: number, y1: number, x2: number, y2: number, opts?: ShapeStyle): void;
  text(x: number, y: number, content: string, opts?: TextStyle): void;
}

export interface Diagram {
  name: string;
  width: number;
  height: number;
  draw(ctx: DrawingContext): void;
}
