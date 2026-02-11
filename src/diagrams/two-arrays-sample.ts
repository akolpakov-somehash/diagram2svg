import type { Diagram, DrawingContext } from "../render/types";
import { drawArrayWithValues } from "./array";

function offsetCtx(ctx: DrawingContext, dx: number, dy: number): DrawingContext {
  return {
    rect: (x, y, width, height, opts) => ctx.rect(x + dx, y + dy, width, height, opts),
    line: (x1, y1, x2, y2, opts) => ctx.line(x1 + dx, y1 + dy, x2 + dx, y2 + dy, opts),
    text: (x, y, content, opts) => ctx.text(x + dx, y + dy, content, opts)
  };
}

const first = drawArrayWithValues(["1", "2", "3", "4", "5"]);
const second = drawArrayWithValues(["6", "7", "8", "9", "10"]);

export const twoArraysSampleDiagram: Diagram = {
  name: "two-arrays-sample",
  width: Math.max(first.width, second.width),
  height: first.height + 140,
  draw(ctx) {
    first.draw(offsetCtx(ctx, 0, 0));
    second.draw(offsetCtx(ctx, 0, 140));
  }
};
