// src/diagrams/median-partition.ts
//
// Diagram: “Median of Two Sorted Arrays” — partition illustration.
// Register in your DIAGRAMS registry as: "median-partition".
//
// This file assumes your project has these types:
//   - Diagram: { name, width, height, draw(ctx) }
//   - DrawingContext: rect/line/text primitives (text supports optional opts)
// and that ctx rect/line accept roughjs-style options (strokeWidth, roughness, bowing, fill, ...).

import type { Diagram, DrawingContext } from "../render/types";

type TextOpts = {
  fontSize?: number;
  fontWeight?: string;
  // Optional helpers if you implement them:
  align?: "left" | "center" | "right";
  anchor?: "start" | "middle" | "end";
};

type ShapeOpts = {
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  fill?: string;
  fillStyle?: string;
  opacity?: number;
};

function drawArrayRow(args: {
  ctx: DrawingContext;
  x: number;
  y: number;
  label: string;
  values: number[];
  cellW: number;
  cellH: number;
  cutIndex: number; // partition between cells: 0..n
  showCutLabel: string; // "i" / "j"
}) {
  const { ctx, x, y, label, values, cellW, cellH, cutIndex, showCutLabel } = args;

  const n = values.length;
  const rowW = n * cellW;

  // Label
  ctx.text(x, y - 34, label, { fontSize: 26, fontWeight: "700", anchor: "start" } as TextOpts);

  // Outer box (single long rectangle)
  ctx.rect(x, y, rowW, cellH, {
    strokeWidth: 4,
    roughness: 1.8,
    bowing: 1.2,
    fill: "transparent",
  } as ShapeOpts);

  // Cell separators (extend a bit beyond the box, like your sketch)
  for (let k = 1; k < n; k++) {
    const sx = x + k * cellW;
    ctx.line(sx, y - 22, sx, y + cellH + 22, {
      strokeWidth: 4,
      roughness: 1.6,
      bowing: 1.1,
    } as ShapeOpts);
  }

  // Numbers (centered in each cell)
  for (let k = 0; k < n; k++) {
    const cx = x + k * cellW + cellW / 2;
    const cy = y + cellH / 2 + 10;
    ctx.text(cx, cy, String(values[k]), {
      fontSize: 56,
      fontWeight: "700",
      anchor: "middle",
    } as TextOpts);
  }

  // Partition line position (between cells)
  const cutX = x + cutIndex * cellW;

  // “Partition” line (slightly thicker + longer)
  ctx.line(cutX, y - 44, cutX, y + cellH + 44, {
    strokeWidth: 7,
    roughness: 1.2,
    bowing: 0.6,
  } as ShapeOpts);

  // Little label under the partition: i / j
  ctx.text(cutX, y + cellH + 72, showCutLabel, {
    fontSize: 28,
    fontWeight: "700",
    anchor: "middle",
  } as TextOpts);

  // Return useful coordinates
  return { rowW, cutX };
}

function highlightCell(ctx: DrawingContext, x: number, y: number, cellW: number, cellH: number, idx: number) {
  // Draw a light “emphasis box” around a cell (roughjs will keep it sketchy)
  ctx.rect(x + idx * cellW + 10, y + 10, cellW - 20, cellH - 20, {
    strokeWidth: 3,
    roughness: 2.2,
    bowing: 1.0,
    opacity: 70,
  } as ShapeOpts);
}

function arrow(ctx: DrawingContext, x1: number, y1: number, x2: number, y2: number) {
  // Simple arrow: line + 2 little “wings”
  ctx.line(x1, y1, x2, y2, { strokeWidth: 3, roughness: 1.4, bowing: 0.8 } as ShapeOpts);

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;

  // arrowhead size
  const s = 14;
  // rotate ±25°
  const ax1 = x2 - (ux * s - uy * s * 0.5);
  const ay1 = y2 - (uy * s + ux * s * 0.5);
  const ax2 = x2 - (ux * s + uy * s * 0.5);
  const ay2 = y2 - (uy * s - ux * s * 0.5);

  ctx.line(x2, y2, ax1, ay1, { strokeWidth: 3, roughness: 1.4, bowing: 0.8 } as ShapeOpts);
  ctx.line(x2, y2, ax2, ay2, { strokeWidth: 3, roughness: 1.4, bowing: 0.8 } as ShapeOpts);
}

export const medianPartitionDiagram: Diagram = {
  name: "median-partition",
  width: 1200,
  height: 720,

  draw(ctx: DrawingContext) {
    // Example arrays (classic)
    const A = [1, 3, 8, 9, 15];
    const B = [7, 11, 18, 19, 21, 25];

    // Pick a VALID partition for the classic example:
    // i = 4, j = 2 => leftA=9 rightA=15, leftB=11 rightB=18
    const i: number = 4;
    const j: number = 2;

    const W = 1200;
    const cellW = 140;
    const cellH = 120;

    // Center rows based on the widest row
    const rowWA = A.length * cellW;
    const rowWB = B.length * cellW;
    const rowWMax = Math.max(rowWA, rowWB);
    const x0 = Math.round((W - rowWMax) / 2);

    const yA = 130;
    const yB = 340;

    // Title
    ctx.text(W / 2, 60, "Median of Two Sorted Arrays — partition", {
      fontSize: 30,
      fontWeight: "800",
      anchor: "middle",
    } as TextOpts);

    // Top row: A
    const aX = x0 + Math.round((rowWMax - rowWA) / 2);
    const aRow = drawArrayRow({
      ctx,
      x: aX,
      y: yA,
      label: "A (nums1)",
      values: A,
      cellW,
      cellH,
      cutIndex: i,
      showCutLabel: "i",
    });

    // Bottom row: B
    const bX = x0 + Math.round((rowWMax - rowWB) / 2);
    const bRow = drawArrayRow({
      ctx,
      x: bX,
      y: yB,
      label: "B (nums2)",
      values: B,
      cellW,
      cellH,
      cutIndex: j,
      showCutLabel: "j",
    });

    // Highlight the 4 border cells (where maxLeft / minRight live)
    if (i > 0) highlightCell(ctx, aX, yA, cellW, cellH, i - 1); // maxLeftA
    if (i < A.length) highlightCell(ctx, aX, yA, cellW, cellH, i); // minRightA
    if (j > 0) highlightCell(ctx, bX, yB, cellW, cellH, j - 1); // maxLeftB
    if (j < B.length) highlightCell(ctx, bX, yB, cellW, cellH, j); // minRightB

    // Compute border values for labels
    const maxLeftA = i === 0 ? "-∞" : String(A[i - 1]);
    const minRightA = i === A.length ? "+∞" : String(A[i]);
    const maxLeftB = j === 0 ? "-∞" : String(B[j - 1]);
    const minRightB = j === B.length ? "+∞" : String(B[j]);

    // Place border labels + arrows
    const labelYTop = yA - 10;
    const labelYBot = yB - 10;

    // A labels
    const aLeftCellCenterX = aX + (Math.max(0, i - 1) * cellW + cellW / 2);
    const aRightCellCenterX = aX + (Math.min(A.length - 1, i) * cellW + cellW / 2);

    ctx.text(aLeftCellCenterX, labelYTop, `maxLeftA = ${maxLeftA}`, {
      fontSize: 20,
      fontWeight: "700",
      anchor: "middle",
    } as TextOpts);
    arrow(ctx, aLeftCellCenterX, labelYTop + 8, aLeftCellCenterX, yA + 20);

    ctx.text(aRightCellCenterX, labelYTop, `minRightA = ${minRightA}`, {
      fontSize: 20,
      fontWeight: "700",
      anchor: "middle",
    } as TextOpts);
    arrow(ctx, aRightCellCenterX, labelYTop + 8, aRightCellCenterX, yA + 20);

    // B labels
    const bLeftCellCenterX = bX + (Math.max(0, j - 1) * cellW + cellW / 2);
    const bRightCellCenterX = bX + (Math.min(B.length - 1, j) * cellW + cellW / 2);

    ctx.text(bLeftCellCenterX, labelYBot, `maxLeftB = ${maxLeftB}`, {
      fontSize: 20,
      fontWeight: "700",
      anchor: "middle",
    } as TextOpts);
    arrow(ctx, bLeftCellCenterX, labelYBot + 8, bLeftCellCenterX, yB + 20);

    ctx.text(bRightCellCenterX, labelYBot, `minRightB = ${minRightB}`, {
      fontSize: 20,
      fontWeight: "700",
      anchor: "middle",
    } as TextOpts);
    arrow(ctx, bRightCellCenterX, labelYBot + 8, bRightCellCenterX, yB + 20);

    // “Validity” conditions box at the bottom
    const boxX = x0;
    const boxY = 520;
    const boxW = rowWMax;
    const boxH = 150;

    ctx.rect(boxX, boxY, boxW, boxH, {
      strokeWidth: 4,
      roughness: 1.8,
      bowing: 1.1,
      fill: "transparent",
    } as ShapeOpts);

    ctx.text(boxX + 20, boxY + 42, "Valid partition when:", {
      fontSize: 24,
      fontWeight: "800",
      anchor: "start",
    } as TextOpts);

    ctx.text(boxX + 40, boxY + 82, "1) maxLeftA ≤ minRightB", {
      fontSize: 22,
      fontWeight: "700",
      anchor: "start",
    } as TextOpts);

    ctx.text(boxX + 40, boxY + 118, "2) maxLeftB ≤ minRightA", {
      fontSize: 22,
      fontWeight: "700",
      anchor: "start",
    } as TextOpts);

    // Little median note on the right side of the box
    ctx.text(boxX + boxW - 20, boxY + 60, "Median:", {
      fontSize: 22,
      fontWeight: "800",
      anchor: "end",
    } as TextOpts);

    ctx.text(boxX + boxW - 20, boxY + 94, "odd  → max(maxLeftA, maxLeftB)", {
      fontSize: 18,
      fontWeight: "700",
      anchor: "end",
    } as TextOpts);

    ctx.text(boxX + boxW - 20, boxY + 124, "even → (max(left)+min(right)) / 2", {
      fontSize: 18,
      fontWeight: "700",
      anchor: "end",
    } as TextOpts);

    // Optional: connect the two partition lines visually (shows “same left size” idea)
    ctx.line(aRow.cutX, yA + cellH + 44, bRow.cutX, yB - 44, {
      strokeWidth: 2,
      roughness: 1.2,
      bowing: 0.8,
      opacity: 60,
    } as ShapeOpts);

    ctx.text(W / 2, yB + cellH + 110, "Binary-search i (in A), derive j (in B) so left side has half the elements.", {
      fontSize: 18,
      fontWeight: "600",
      anchor: "middle",
    } as TextOpts);
  },
};

export default medianPartitionDiagram;
