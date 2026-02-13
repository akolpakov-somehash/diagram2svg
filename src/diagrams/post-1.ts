import type { Diagram, DrawingContext } from "../render/types";
import { drawArrayWithFilledCells, drawArrayWithValues } from "./array";
import { drawArrow } from "./symbols";

export const p1SampleMergedArr = drawArrayWithValues(["1", "2", "3", "4", "5"]);

export const p1MedianEven = drawArrayWithFilledCells(["1", "2", "3", "4", "5", "6"], [2, 3]);
export const p1MedianOdd = drawArrayWithFilledCells(["1", "2", "3"], [1]);

//simple merge

const LAYOUT = {
  plus: {
    text: "+",
    fontSize: 48,
    xShift: 40,
    yShift: 80
  },
  rightArrayXShift: 80,
  widthPadding: 80,
  bottomRowYShift: 260,
  arrowTopY: 200,
  arrowBottomOffsetFromBottomRow: 40,
  heightPadding: 80
} as const;

const first = drawArrayWithValues(["1", "3", "5"]);
const second = drawArrayWithValues(["2", "4", "6"]);
const merged = drawArrayWithFilledCells(["1", "2", "3", "4", "5", "6"], [2, 3]);

const topRowWidth = first.width + second.width - LAYOUT.rightArrayXShift;
const canvasWidth = Math.max(topRowWidth, merged.width) + LAYOUT.widthPadding;
const topRowXShift = Math.floor((canvasWidth - topRowWidth) / 2);
const secondXShift = topRowXShift + first.width - LAYOUT.rightArrayXShift;
const mergedXShift = Math.floor((canvasWidth - merged.width) / 2);
const arrowX = Math.floor(canvasWidth / 2);
const arrowBottomY = LAYOUT.bottomRowYShift + LAYOUT.arrowBottomOffsetFromBottomRow;
const mergeArrow = drawArrow(arrowX, LAYOUT.arrowTopY, arrowX, arrowBottomY);

function drawWithOffset(ctx: DrawingContext, diagram: Diagram, dx: number, dy: number): void {
  diagram.draw({
    rect: (x, y, width, height, opts) => ctx.rect(x + dx, y + dy, width, height, opts),
    line: (x1, y1, x2, y2, opts) => ctx.line(x1 + dx, y1 + dy, x2 + dx, y2 + dy, opts),
    text: (x, y, content, opts) => ctx.text(x + dx, y + dy, content, opts)
  });
}

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

export const p1SimpleMerge: Diagram = {
  name: "p1-simple-merge",
  width: canvasWidth,
  height: LAYOUT.bottomRowYShift + merged.height + LAYOUT.heightPadding,
  draw(ctx) {
    drawWithOffset(ctx, first, topRowXShift, 0);
    drawWithOffset(ctx, plus, topRowXShift, 0);
    drawWithOffset(ctx, second, secondXShift, 0);
    mergeArrow.draw(ctx);
    drawWithOffset(ctx, merged, mergedXShift, LAYOUT.bottomRowYShift);
  }
};
