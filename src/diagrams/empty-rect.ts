import type { Diagram } from "../render/types";

export const emptyRectDiagram: Diagram = {
  name: "empty-rect",
  width: 800,
  height: 400,
  draw(ctx) {
    ctx.rect(80, 80, 640, 240, { fill: "transparent" });
  }
};
