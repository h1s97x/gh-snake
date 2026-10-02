import { isInsideLarge, getColor, isInside, isEmpty } from "../types";
import { around4 } from "../types";
import { getHeadX, getHeadY, nextSnake, snakeWillSelfCollide } from "../types";
import { MinHeap, byKeyId } from "./utils/minHeap";
import type { Snake } from "../types";
import type { Grid } from "../types";

type M = {
  parent: M | null;
  snake: Snake;
  w: number;
  h: number;
  f: number;
  id: number;
};

/**
 * starting from snake0, get to the cell x,y
 * return the snake chain (reversed)
 */
export const getPathTo = (grid: Grid, snake0: Snake, x: number, y: number) => {
  let id = 0;
  const open = new MinHeap<M>(byKeyId((m) => m.f));
  open.push({ snake: snake0, w: 0, id: id++ } as M);
  const closed = new Set<string>();

  while (open.size) {
    const c = open.pop()!;

    const cx = getHeadX(c.snake);
    const cy = getHeadY(c.snake);

    for (let i = 0; i < around4.length; i++) {
      const { x: dx, y: dy } = around4[i];

      const nx = cx + dx;
      const ny = cy + dy;

      if (nx === x && ny === y) {
        // unwrap
        const path = [nextSnake(c.snake, dx, dy)];
        let e: M["parent"] = c;
        while (e.parent) {
          path.push(e.snake);
          e = e.parent;
        }
        return path;
      }

      if (
        isInsideLarge(grid, 2, nx, ny) &&
        !snakeWillSelfCollide(c.snake, dx, dy) &&
        (!isInside(grid, nx, ny) || isEmpty(getColor(grid, nx, ny)))
      ) {
        const nsnake = nextSnake(c.snake, dx, dy);
        const key = nsnake.join(",");
        if (!closed.has(key)) {
          closed.add(key);
          const w = c.w + 1;
          const h = Math.abs(nx - x) + Math.abs(ny - y);
          const f = w + h;
          open.push({ snake: nsnake, parent: c, w, h, f, id: id++ });
        }
      }
    }
  }
};
