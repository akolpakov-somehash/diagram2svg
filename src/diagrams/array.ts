import type { Diagram } from "../render/types";

export const arrayRectDiagram: Diagram = {
  name: "empty-rect",
  width: 800,
  height: 400,
  draw(ctx) {
    ctx.rect(80, 80, 640, 240, { fill: "transparent" });
    ctx.line(190, 70, 190, 350);
  }
};

const defaultHeight = 400;
const defaultCellWidth = 80;
const withPadding = 160;
const defaultX = 80;
const defaultY = 80;

export function drawArray(numCels: number, cellWidth: number = defaultCellWidth): Diagram {
  return {
    name: `array-${numCels}`,
    width: cellWidth * numCels + withPadding,
    height: defaultHeight,
    draw(ctx) {
      ctx.rect(defaultX, defaultY, cellWidth * numCels, cellWidth, { fill: "transparent" });
      for (let i = 1; i < numCels; i++) {
        ctx.line(defaultX + cellWidth * i, defaultY, defaultX + cellWidth * i, cellWidth + defaultY);
      }
    }
  };
}

export function drawArrayWithValues(values: string[], cellWidth: number = defaultCellWidth): Diagram {
  return {
    name: `array-${values.length}`,
    width: cellWidth * values.length + 160,
    height: 400,
    draw(ctx) {
      ctx.rect(80, 80, cellWidth * values.length, cellWidth, { fill: "transparent" });
      for (let i = 1; i < values.length; i++) {
        ctx.line(80 + cellWidth * i, 80, 80 + cellWidth * i, cellWidth + 80);
      }
      // for (let i = 0; i < values.length; i++) {
      //   ctx.text(values[i], 80 + cellWidth * i + cellWidth / 2, 80 + cellWidth / 2);
      // }
    }
  };
}

export const arr10Diagram = drawArray(10);
