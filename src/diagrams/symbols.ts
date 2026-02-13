import type { Diagram } from "../render/types";

const DEFAULTS = {
  padding: 80,
  headLength: 22,
  headAngleDeg: 28
} as const;

function degToRad(value: number): number {
  return (value * Math.PI) / 180;
}

function getArrowHeadPoints(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  headLength: number,
  headAngleRad: number
): { leftX: number; leftY: number; rightX: number; rightY: number } {
  const angle = Math.atan2(endY - startY, endX - startX);
  const reverse = angle + Math.PI;
  const leftAngle = reverse + headAngleRad;
  const rightAngle = reverse - headAngleRad;

  return {
    leftX: endX + Math.cos(leftAngle) * headLength,
    leftY: endY + Math.sin(leftAngle) * headLength,
    rightX: endX + Math.cos(rightAngle) * headLength,
    rightY: endY + Math.sin(rightAngle) * headLength
  };
}

export function drawArrow(startX: number, startY: number, endX: number, endY: number): Diagram {
  const head = getArrowHeadPoints(
    startX,
    startY,
    endX,
    endY,
    DEFAULTS.headLength,
    degToRad(DEFAULTS.headAngleDeg)
  );

  const maxX = Math.max(startX, endX, head.leftX, head.rightX);
  const maxY = Math.max(startY, endY, head.leftY, head.rightY);

  return {
    name: "arrow",
    width: Math.ceil(maxX + DEFAULTS.padding),
    height: Math.ceil(maxY + DEFAULTS.padding),
    draw(ctx) {
      ctx.line(startX, startY, endX, endY);
      ctx.line(endX, endY, head.leftX, head.leftY);
      ctx.line(endX, endY, head.rightX, head.rightY);
    }
  };
}

export const sampleArrow = drawArrow(80, 140, 420, 220);
