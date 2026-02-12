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

const DEFAULTS = {
  cellWidth: 80,
  widthPadding: 160,
  heightPadding: 160,
  x: 80,
  y: 80,
} as const;

function getRandomIntBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function drawArray(numCels: number, cellWidth: number = DEFAULTS.cellWidth): Diagram {
  return {
    name: `array-${numCels}`,
    width: cellWidth * numCels + DEFAULTS.widthPadding,
    height: cellWidth + DEFAULTS.heightPadding,
    draw(ctx) {
      ctx.rect(DEFAULTS.x, DEFAULTS.y, cellWidth * numCels, cellWidth, { fill: "transparent" });
      for (let i = 1; i < numCels; i++) {
        let randUp = getRandomIntBetween(10, 20);
        let randBottom = getRandomIntBetween(10, 20);
        ctx.line(DEFAULTS.x + cellWidth * i, DEFAULTS.y - randUp, DEFAULTS.x + cellWidth * i, cellWidth + DEFAULTS.y + randBottom);
      }
    }
  };
}

export function drawArrayWithValues(values: string[], cellWidth: number = DEFAULTS.cellWidth): Diagram {
  return {
    name: `array-${values.length}`,
    width: cellWidth * values.length + 160,
    height: 400,
    draw(ctx) {
      ctx.rect(DEFAULTS.x, DEFAULTS.y, cellWidth * values.length, cellWidth, { fill: "transparent" });
      for (let i = 1; i < values.length; i++) {
        let randUp = getRandomIntBetween(10, 20);
        let randBottom = getRandomIntBetween(10, 20);
        if (i > 0){
            ctx.line(DEFAULTS.x + cellWidth * i, DEFAULTS.y - randUp, DEFAULTS.x + cellWidth * i, cellWidth + DEFAULTS.y + randBottom);
        }
        ctx.text(
          DEFAULTS.x + cellWidth * i + cellWidth / 2,
          DEFAULTS.y + cellWidth / 2,
          values[i],
          { textAnchor: "middle", dominantBaseline: "middle" }
        );
      }
    }
  };
}

export function drawArrayWithFilledCells(values: string[], filled: number[], cellWidth: number = DEFAULTS.cellWidth, color: string = "red", style: string = "zigzag"): Diagram {
  return {
    name: `array-${values.length}`,
    width: cellWidth * values.length + 160,
    height: 400,
    draw(ctx) {
      ctx.rect(DEFAULTS.x, DEFAULTS.y, cellWidth * values.length, cellWidth, { fill: "transparent" });
      for (let i = 0; i < values.length; i++) {
        let randUp = getRandomIntBetween(10, 20);
        let randBottom = getRandomIntBetween(10, 20);
        if (i > 0){
            ctx.line(DEFAULTS.x + cellWidth * i, DEFAULTS.y - randUp, DEFAULTS.x + cellWidth * i, cellWidth + DEFAULTS.y + randBottom);
        }
        if (filled.indexOf(i) > -1) {
            ctx.rect(DEFAULTS.x+cellWidth*i, DEFAULTS.y, cellWidth, cellWidth, {stroke:"none", fill: color, fillStyle: style})
        }
        ctx.text(
          DEFAULTS.x + cellWidth * i + cellWidth / 2,
          DEFAULTS.y + cellWidth / 2,
          values[i],
          { textAnchor: "middle", dominantBaseline: "middle" }
        );
      }
    }
  };
}

export const arrFilled = drawArrayWithFilledCells(["a","b", "c"], [1])
export const arr10Diagram = drawArray(10);
export const arrTxtDiagram = drawArrayWithValues(["a", "b", "c"]);
