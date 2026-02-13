import type { Theme } from "./theme";

const SVG_NS = "http://www.w3.org/2000/svg";

export function ensureGlowFilter(svg: SVGSVGElement, theme: Theme): string | null {
  const glow = theme.glow;
  if (!glow) {
    return null;
  }

  if (svg.querySelector(`filter#${glow.filterId}`)) {
    return glow.filterId;
  }

  const document = svg.ownerDocument;
  let defs = svg.querySelector("defs");
  if (!defs) {
    defs = document.createElementNS(SVG_NS, "defs");
    svg.insertBefore(defs, svg.firstChild);
  }

  const filter = document.createElementNS(SVG_NS, "filter");
  filter.setAttribute("id", glow.filterId);
  // Use viewport/user-space units so thin vertical/horizontal lines keep a valid filter region.
  filter.setAttribute("filterUnits", "userSpaceOnUse");
  filter.setAttribute("x", glow.x);
  filter.setAttribute("y", glow.y);
  filter.setAttribute("width", glow.width);
  filter.setAttribute("height", glow.height);

  const outerBlur = document.createElementNS(SVG_NS, "feGaussianBlur");
  outerBlur.setAttribute("in", "SourceGraphic");
  outerBlur.setAttribute("stdDeviation", String(glow.stdDeviation * 2));
  outerBlur.setAttribute("result", "glow-outer");
  filter.appendChild(outerBlur);

  const innerBlur = document.createElementNS(SVG_NS, "feGaussianBlur");
  innerBlur.setAttribute("in", "SourceGraphic");
  innerBlur.setAttribute("stdDeviation", String(glow.stdDeviation));
  innerBlur.setAttribute("result", "glow-inner");
  filter.appendChild(innerBlur);

  const merge = document.createElementNS(SVG_NS, "feMerge");

  const mergeOuter = document.createElementNS(SVG_NS, "feMergeNode");
  mergeOuter.setAttribute("in", "glow-outer");
  merge.appendChild(mergeOuter);

  const mergeInner = document.createElementNS(SVG_NS, "feMergeNode");
  mergeInner.setAttribute("in", "glow-inner");
  merge.appendChild(mergeInner);

  const mergeOriginal = document.createElementNS(SVG_NS, "feMergeNode");
  mergeOriginal.setAttribute("in", "SourceGraphic");
  merge.appendChild(mergeOriginal);

  filter.appendChild(merge);
  defs.appendChild(filter);

  return glow.filterId;
}

export function applyGlowFilter(node: Element, glowFilterId: string | null): void {
  if (!glowFilterId) {
    return;
  }

  node.setAttribute("filter", `url(#${glowFilterId})`);
}
