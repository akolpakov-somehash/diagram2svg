import type { Diagram } from "../render/types";
import { drawArrayWithValues } from "./array";

const LAYOUT = {
  plus: {
    text: "+",
    fontSize: 48,
    xShift: 40,
    yShift: 80
  },
  rightArrayXShift: 80,
  widthPadding: 80,
  heightPadding: 140
} as const;

const first = drawArrayWithValues(["1", "2", "3", "4", "5"]);
const second = drawArrayWithValues(["6", "7", "8", "9", "10"]);
const plus: Diagram = {
  name: "plus",
  width: 0,
  height: 0,
  draw(ctx) {
    ctx.text(first.width - LAYOUT.plus.xShift, first.height / 2 - LAYOUT.plus.yShift, LAYOUT.plus.text, {
      textAnchor: "middle",
      dominantBaseline: "middle",
      fontSize: LAYOUT.plus.fontSize
    });
  }
};

export const twoArraysSampleDiagram: Diagram = {
  name: "two-arrays-sample",
  width: first.width + second.width + LAYOUT.widthPadding,
  height: first.height + LAYOUT.heightPadding,
  draw(ctx) {
    first.draw(ctx);
    plus.draw(ctx);
    const dx = first.width - LAYOUT.rightArrayXShift;
    second.draw({
      rect: (x, y, width, height, opts) => ctx.rect(x + dx, y, width, height, opts),
      line: (x1, y1, x2, y2, opts) => ctx.line(x1 + dx, y1, x2 + dx, y2, opts),
      text: (x, y, content, opts) => ctx.text(x + dx, y, content, opts)
    });
  }
};
