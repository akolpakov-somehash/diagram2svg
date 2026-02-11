import { JSDOM } from "jsdom";
import rough from "roughjs";
import type { Options as RoughOptions } from "roughjs/bin/core";
import { DEFAULT_THEME, type Theme } from "./theme";
import type { Diagram, DrawingContext, ShapeStyle } from "./types";

export interface RenderOptions {
  padding?: number;
  background?: string | null;
}

function toRoughOptions(theme: Theme, style?: ShapeStyle): RoughOptions {
  return {
    stroke: style?.stroke ?? theme.stroke,
    strokeWidth: style?.strokeWidth ?? theme.strokeWidth,
    roughness: style?.roughness ?? theme.roughness,
    bowing: style?.bowing ?? theme.bowing,
    fill: style?.fill ?? theme.fill
  };
}

function createDrawingContext(
  svg: SVGSVGElement,
  rc: ReturnType<typeof rough.svg>,
  theme: Theme,
  offsetX: number,
  offsetY: number
): DrawingContext {
  const svgNs = "http://www.w3.org/2000/svg";
  const document = svg.ownerDocument;

  return {
    rect(x, y, width, height, opts) {
      const node = rc.rectangle(x + offsetX, y + offsetY, width, height, toRoughOptions(theme, opts));
      if (typeof opts?.opacity === "number") {
        node.setAttribute("opacity", String(Math.max(0, Math.min(1, opts.opacity / 100))));
      }
      svg.appendChild(node);
    },
    line(x1, y1, x2, y2, opts) {
      const node = rc.line(x1 + offsetX, y1 + offsetY, x2 + offsetX, y2 + offsetY, toRoughOptions(theme, opts));
      if (typeof opts?.opacity === "number") {
        node.setAttribute("opacity", String(Math.max(0, Math.min(1, opts.opacity / 100))));
      }
      svg.appendChild(node);
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

  const rc = rough.svg(svg);
  const ctx = createDrawingContext(svg, rc, DEFAULT_THEME, padding, padding);
  diagram.draw(ctx);

  const serialized = new dom.window.XMLSerializer().serializeToString(svg);
  return `${serialized}\n`;
}
