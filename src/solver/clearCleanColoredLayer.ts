import {
  getColor,
  isEmpty,
  isInside,
  isInsideLarge,
  setColorEmpty,
} from "../types";
import {
  getHeadX,
  getHeadY,
  getSnakeLength,
  nextSnake,
  snakeWillSelfCollide,
} from "../types";
import { around4, Point } from "../types";
import { getBestTunnel } from "./getBestTunnel";
import { fillOutside } from "./outside";
import type { Outside } from "./outside";
import type { Snake } from "../types";
import type { Color, Empty, Grid } from "../types";

export const clearCleanColoredLayer = (
  grid: Grid,
  outside: Outside,
  snake0: Snake,
  color: Color,
) => {
  const snakeN = getSnakeLength(snake0);

  const points = getTunnellablePoints(grid, outside, snakeN, color);

  const chain: Snake[] = [snake0];

  while (points.length) {
    const path = getPathToNextPoint(grid, chain[0], color, points)!;
    path.pop();

    for (const snake of path)
      setEmptySafe(grid, getHeadX(snake), getHeadY(snake));

    chain.unshift(...path);
  }

  fillOutside(outside, grid);

  chain.pop();
  return chain;
};

type M = { snake: Snake; parent: M | null };
const unwrap = (m: M | null): Snake[] =>
  !m ? [] : [m.snake, ...unwrap(m.parent)];

/**
 * greedy nearest-target search.
 *
 * every edge costs 1, so this is plain BFS — a priority queue is unnecessary.
 * we therefore use a FIFO queue (head pointer, O(1) dequeue) instead of the
 * original `openList.shift()` which was O(n), and a `Set` keyed by the full
 * snake state instead of `closeList.some()` which was O(n) per node.
 *
 * the closed set is keyed on the *whole* snake (head + body), not just the
 * head: two snakes sharing a head but differing in body are both valid states.
 * traversal order (right → up → left → down, FIFO) is preserved, so the chosen
 * path is identical to before.
 */
const getPathToNextPoint = (
  grid: Grid,
  snake0: Snake,
  color: Color,
  points: Point[],
) => {
  const open: M[] = [{ snake: snake0, parent: null }];
  const closed = new Set<string>([snake0.join(",")]);
  let head = 0;

  while (head < open.length) {
    const o = open[head++];

    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);

    const i = points.findIndex((p) => p.x === x && p.y === y);
    if (i >= 0) {
      points.splice(i, 1);
      return unwrap(o);
    }

    for (const { x: dx, y: dy } of around4) {
      if (
        isInsideLarge(grid, 2, x + dx, y + dy) &&
        !snakeWillSelfCollide(o.snake, dx, dy) &&
        getColorSafe(grid, x + dx, y + dy) <= color
      ) {
        const snake = nextSnake(o.snake, dx, dy);
        const key = snake.join(",");
        if (!closed.has(key)) {
          closed.add(key);
          open.push({ snake, parent: o });
        }
      }
    }
  }
};

/**
 * get all cells that are tunnellable
 */
export const getTunnellablePoints = (
  grid: Grid,
  outside: Outside,
  snakeN: number,
  color: Color,
) => {
  const points: Point[] = [];

  for (let x = grid.width; x--; )
    for (let y = grid.height; y--; ) {
      const c = getColor(grid, x, y);
      if (
        !isEmpty(c) &&
        c <= color &&
        !points.some((p) => p.x === x && p.y === y)
      ) {
        const tunnel = getBestTunnel(grid, outside, x, y, color, snakeN);

        if (tunnel)
          for (const p of tunnel)
            if (!isEmptySafe(grid, p.x, p.y)) points.push(p);
      }
    }

  return points;
};

const getColorSafe = (grid: Grid, x: number, y: number) =>
  isInside(grid, x, y) ? getColor(grid, x, y) : (0 as Empty);

const setEmptySafe = (grid: Grid, x: number, y: number) => {
  if (isInside(grid, x, y)) setColorEmpty(grid, x, y);
};

const isEmptySafe = (grid: Grid, x: number, y: number) =>
  !isInside(grid, x, y) && isEmpty(getColor(grid, x, y));
