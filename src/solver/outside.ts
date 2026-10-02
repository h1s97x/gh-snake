import {
  createEmptyGrid,
  getColor,
  isEmpty,
  isInside,
  setColorEmpty,
} from "../types";
import { around4 } from "../types";
import type { Color, Grid } from "../types";

export type Outside = Grid & { __outside: true };

export const createOutside = (grid: Grid, color: Color = 0 as Color) => {
  const outside = createEmptyGrid(grid.width, grid.height) as Outside;
  fillOutside(outside, grid, color);
  return outside;
};

/**
 * Mark every in-grid cell that the snake can reach from off the grid without
 * crossing a cell of color `> color`.
 *
 * A cell counts as "outside" exactly when it is NOT enclosed by higher-color
 * "walls" — i.e. when a path of passable cells (grid value `<= color`) connects
 * it to the grid's exterior. Enclosed pockets must instead be reached by
 * tunnelling (see getBestTunnel).
 *
 * In the `outside` grid: `1` = blocked/enclosed, `0` = outside.
 *
 * This is a single BFS flood from the border (the only cells touching the
 * exterior) instead of the original repeated full-grid relaxation, so it is
 * O(W·H) per call regardless of how many pockets exist, and the result is
 * identical to the fixpoint computed by the relaxation.
 */
export const fillOutside = (
  outside: Outside,
  grid: Grid,
  color: Color = 0 as Color,
) => {
  outside.data.fill(1);

  const { width, height } = grid;
  const idx = (x: number, y: number) => x * height + y;

  const queue: number[] = [];
  for (let x = 0; x < width; x++)
    for (let y = 0; y < height; y++) {
      const onBorder =
        x === 0 || y === 0 || x === width - 1 || y === height - 1;
      if (onBorder && getColor(grid, x, y) <= color) {
        setColorEmpty(outside, x, y);
        queue.push(idx(x, y));
      }
    }

  while (queue.length) {
    const k = queue.pop()!;
    const x = (k / height) | 0;
    const y = k % height;

    for (let i = 0; i < around4.length; i++) {
      const nx = x + around4[i].x;
      const ny = y + around4[i].y;
      if (
        isInside(grid, nx, ny) &&
        getColor(grid, nx, ny) <= color &&
        !isEmpty(getColor(outside, nx, ny))
      ) {
        setColorEmpty(outside, nx, ny);
        queue.push(idx(nx, ny));
      }
    }
  }

  return outside;
};

export const isOutside = (outside: Outside, x: number, y: number) =>
  !isInside(outside, x, y) || isEmpty(getColor(outside, x, y));
