import { JSDOM } from "jsdom";
import { getStroke } from "perfect-freehand";
import { DEFAULT_THEME, type Theme } from "./theme";
import type { Diagram, DrawingContext, ShapeStyle } from "./types";

export interface RenderOptions {
  padding?: number;
  background?: string | null;
}

type Point = [number, number];

interface ResolvedShapeStyle {
  stroke: string;
  strokeWidth: number;
  roughness: number;
  bowing: number;
  fill: string;
  opacity?: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isVisibleFill(fill: string): boolean {
  const normalized = fill.trim().toLowerCase();
  return normalized !== "none" && normalized !== "transparent";
}

function noise(seed: number): number {
  const value = Math.sin(seed * 12.9898) * 43758.5453;
  return (value - Math.floor(value)) * 2 - 1;
}

function resolveStyle(theme: Theme, style?: ShapeStyle): ResolvedShapeStyle {
  return {
    stroke: style?.stroke ?? theme.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth,
    roughness: style?.roughness ?? theme.roughness,
    bowing: style?.bowing ?? theme.bowing,
    fill: style?.fill ?? theme.fill,
    opacity: style?.opacity
  };
}

function getSvgPathFromStroke(stroke: Point[]): string {
  if (stroke.length === 0) {
    return "";
  }

  let d = `M ${stroke[0][0]} ${stroke[0][1]} Q`;

  for (let i = 0; i < stroke.length; i += 1) {
    const [x0, y0] = stroke[i];
    const [x1, y1] = stroke[(i + 1) % stroke.length];
    const midX = (x0 + x1) / 2;
    const midY = (y0 + y1) / 2;
    d += ` ${x0} ${y0} ${midX} ${midY}`;
  }

  return `${d} Z`;
}

function segmentPoints(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  roughness: number,
  bowing: number,
  seed: number
): Point[] {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (length === 0) {
    return [
      [x1, y1],
      [x1 + 0.1, y1 + 0.1]
    ];
  }

  const ux = dx / length;
  const uy = dy / length;
  const nx = -uy;
  const ny = ux;
  const steps = Math.max(8, Math.ceil(length / 28));
  const bowAmplitude = noise(seed + 0.11) * bowing * Math.min(12, length * 0.08);
  const jitterAmplitude = roughness * Math.min(6, length * 0.06);
  const points: Point[] = [];

  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const baseX = x1 + dx * t;
    const baseY = y1 + dy * t;
    const curveOffset = Math.sin(Math.PI * t) * bowAmplitude;
    const jitterOffset =
      noise(seed + i * 0.73 + 0.17) * jitterAmplitude * (0.35 + Math.sin(Math.PI * t) * 0.65);
    const offset = curveOffset + jitterOffset;
    points.push([baseX + nx * offset, baseY + ny * offset]);
  }

  return points;
}

function createStrokePath(points: Point[], style: ResolvedShapeStyle): string {
  const smoothing = clamp(0.45 + style.bowing * 0.04, 0.2, 0.95);
  const streamline = clamp(0.35 - style.roughness * 0.03, 0.02, 0.7);
  const stroke = getStroke(points, {
    size: Math.max(1, style.strokeWidth),
    thinning: 0.2,
    smoothing,
    streamline,
    simulatePressure: false
  }) as Point[];

  return getSvgPathFromStroke(stroke);
}

function createDrawingContext(
  svg: SVGSVGElement,
  theme: Theme,
  offsetX: number,
  offsetY: number
): DrawingContext {
  const svgNs = "http://www.w3.org/2000/svg";
  const document = svg.ownerDocument;

  function appendStrokePath(points: Point[], style: ResolvedShapeStyle): void {
    const d = createStrokePath(points, style);
    if (!d) {
      return;
    }
    const path = document.createElementNS(svgNs, "path");
    path.setAttribute("d", d);
    path.setAttribute("fill", style.stroke);
    path.setAttribute("stroke", "none");
    if (typeof style.opacity === "number") {
      path.setAttribute("opacity", String(clamp(style.opacity / 100, 0, 1)));
    }
    svg.appendChild(path);
  }

  return {
    rect(x, y, width, height, opts) {
      const resolved = resolveStyle(theme, opts);
      const left = x + offsetX;
      const top = y + offsetY;
      const right = left + width;
      const bottom = top + height;

      if (isVisibleFill(resolved.fill)) {
        const fillRect = document.createElementNS(svgNs, "rect");
        fillRect.setAttribute("x", String(left));
        fillRect.setAttribute("y", String(top));
        fillRect.setAttribute("width", String(width));
        fillRect.setAttribute("height", String(height));
        fillRect.setAttribute("fill", resolved.fill);
        if (typeof resolved.opacity === "number") {
          fillRect.setAttribute("opacity", String(clamp(resolved.opacity / 100, 0, 1)));
        }
        svg.appendChild(fillRect);
      }

      appendStrokePath(segmentPoints(left, top, right, top, resolved.roughness, resolved.bowing, left + top), resolved);
      appendStrokePath(
        segmentPoints(right, top, right, bottom, resolved.roughness, resolved.bowing, right + top + 11),
        resolved
      );
      appendStrokePath(
        segmentPoints(right, bottom, left, bottom, resolved.roughness, resolved.bowing, right + bottom + 23),
        resolved
      );
      appendStrokePath(
        segmentPoints(left, bottom, left, top, resolved.roughness, resolved.bowing, left + bottom + 37),
        resolved
      );
    },
    line(x1, y1, x2, y2, opts) {
      const resolved = resolveStyle(theme, opts);
      const sx = x1 + offsetX;
      const sy = y1 + offsetY;
      const ex = x2 + offsetX;
      const ey = y2 + offsetY;
      appendStrokePath(segmentPoints(sx, sy, ex, ey, resolved.roughness, resolved.bowing, sx + sy + ex + ey), resolved);
    },
    text(x, y, content, opts) {
      const text = document.createElementNS(svgNs, "text");
      text.setAttribute("x", String(x + offsetX));
      text.setAttribute("y", String(y + offsetY));
      text.setAttribute("fill", opts?.fill ?? theme.stroke);
      text.setAttribute("font-family", opts?.fontFamily ?? theme.fontFamily);
      text.setAttribute("font-size", String(opts?.fontSize ?? theme.fontSize));
      if (opts?.fontWeight) {
        text.setAttribute("font-weight", String(opts.fontWeight));
      }
      const textAnchor = opts?.textAnchor ?? opts?.anchor;
      if (textAnchor) {
        text.setAttribute("text-anchor", textAnchor);
      }
      if (opts?.dominantBaseline) {
        text.setAttribute("dominant-baseline", opts.dominantBaseline);
      }
      text.textContent = content;
      svg.appendChild(text);
    }
  };
}

export function renderDiagramToSvg(diagram: Diagram, options: RenderOptions = {}): string {
  const padding = options.padding ?? 0;
  const background = options.background ?? null;
  const width = diagram.width + padding * 2;
  const height = diagram.height + padding * 2;
  const svgNs = "http://www.w3.org/2000/svg";

  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  const document = dom.window.document;
  const svg = document.createElementNS(svgNs, "svg") as SVGSVGElement;

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);

  if (background) {
    const bg = document.createElementNS(svgNs, "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", String(width));
    bg.setAttribute("height", String(height));
    bg.setAttribute("fill", background);
    svg.appendChild(bg);
  }

  const ctx = createDrawingContext(svg, DEFAULT_THEME, padding, padding);
  diagram.draw(ctx);

  const serialized = new dom.window.XMLSerializer().serializeToString(svg);
  return `${serialized}\n`;
}
