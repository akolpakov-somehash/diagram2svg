import { JSDOM } from "jsdom";
import { applyGlowFilter, ensureGlowFilter } from "./glowFilter";
import { DEFAULT_THEME, type Theme } from "./theme";
import type { Diagram, DrawingContext } from "./types";

export interface RenderOptions {
  padding?: number;
  background?: string | null;
  theme?: Theme;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toOpacityValue(opacity: number | undefined): string | null {
  if (typeof opacity !== "number") {
    return null;
  }

  return String(clamp(opacity / 100, 0, 1));
}

function createDrawingContext(
  svg: SVGSVGElement,
  shapeLayer: SVGGElement,
  theme: Theme,
  offsetX: number,
  offsetY: number
): DrawingContext {
  const svgNs = "http://www.w3.org/2000/svg";
  const document = svg.ownerDocument;

  return {
    rect(x, y, width, height, opts) {
      const rect = document.createElementNS(svgNs, "rect");
      rect.setAttribute("x", String(x + offsetX));
      rect.setAttribute("y", String(y + offsetY));
      rect.setAttribute("width", String(width));
      rect.setAttribute("height", String(height));
      rect.setAttribute("stroke", opts?.stroke ?? theme.stroke);
      rect.setAttribute("stroke-width", String(opts?.strokeWidth ?? theme.strokeWidth));
      rect.setAttribute("fill", opts?.fill ?? theme.fill);
      const opacity = toOpacityValue(opts?.opacity);
      if (opacity) {
        rect.setAttribute("opacity", opacity);
      }
      shapeLayer.appendChild(rect);
    },
    line(x1, y1, x2, y2, opts) {
      const line = document.createElementNS(svgNs, "line");
      line.setAttribute("x1", String(x1 + offsetX));
      line.setAttribute("y1", String(y1 + offsetY));
      line.setAttribute("x2", String(x2 + offsetX));
      line.setAttribute("y2", String(y2 + offsetY));
      line.setAttribute("stroke", opts?.stroke ?? theme.stroke);
      line.setAttribute("stroke-width", String(opts?.strokeWidth ?? theme.strokeWidth));
      const opacity = toOpacityValue(opts?.opacity);
      if (opacity) {
        line.setAttribute("opacity", opacity);
      }
      shapeLayer.appendChild(line);
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
  const theme = options.theme ?? DEFAULT_THEME;
  const width = diagram.width + padding * 2;
  const height = diagram.height + padding * 2;
  const svgNs = "http://www.w3.org/2000/svg";

  const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
  const document = dom.window.document;
  const svg = document.createElementNS(svgNs, "svg") as SVGSVGElement;

  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("shape-rendering", "geometricPrecision");

  if (background) {
    const bg = document.createElementNS(svgNs, "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", String(width));
    bg.setAttribute("height", String(height));
    bg.setAttribute("fill", background);
    svg.appendChild(bg);
  }

  const glowFilterId = ensureGlowFilter(svg, theme);
  const shapeLayer = document.createElementNS(svgNs, "g") as SVGGElement;
  applyGlowFilter(shapeLayer, glowFilterId);
  svg.appendChild(shapeLayer);

  const ctx = createDrawingContext(svg, shapeLayer, theme, padding, padding);
  diagram.draw(ctx);

  const serialized = new dom.window.XMLSerializer().serializeToString(svg);
  return `${serialized}\n`;
}
