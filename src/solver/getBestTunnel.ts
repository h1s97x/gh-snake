import { copyGrid, getColor, isInside, setColorEmpty } from "../types";
import { around4 } from "../types";
import {
  createSnakeFromCells,
  getHeadX,
  getHeadY,
  nextSnake,
  snakeWillSelfCollide,
} from "../types";
import { isOutside } from "./outside";
import { trimTunnelEnd, trimTunnelStart } from "./tunnel";
import { MinHeap, byKeyId } from "./utils/minHeap";
import type { Outside } from "./outside";
import type { Snake } from "../types";
import type { Empty, Color, Grid } from "../types";
import type { Point } from "../types";

const getColorSafe = (grid: Grid, x: number, y: number) =>
  isInside(grid, x, y) ? getColor(grid, x, y) : (0 as Empty);

const setEmptySafe = (grid: Grid, x: number, y: number) => {
  if (isInside(grid, x, y)) setColorEmpty(grid, x, y);
};

type M = { snake: Snake; parent: M | null; w: number; id: number };

const unwrap = (m: M | null): Point[] =>
  !m
    ? []
    : [...unwrap(m.parent), { x: getHeadX(m.snake), y: getHeadY(m.snake) }];

/**
 * returns the path to reach the outside which contains the least color cell
 */
const getSnakeEscapePath = (
  grid: Grid,
  outside: Outside,
  snake0: Snake,
  color: Color,
) => {
  let id = 0;
  const open = new MinHeap<M>(byKeyId((m) => m.w));
  open.push({ snake: snake0, w: 0, id: id++ } as M);
  const closed = new Set<string>();

  while (open.size) {
    const o = open.pop()!;

    const x = getHeadX(o.snake);
    const y = getHeadY(o.snake);

    if (isOutside(outside, x, y)) return unwrap(o);

    for (const a of around4) {
      const c = getColorSafe(grid, x + a.x, y + a.y);

      if (c <= color && !snakeWillSelfCollide(o.snake, a.x, a.y)) {
        const snake = nextSnake(o.snake, a.x, a.y);
        const key = snake.join(",");
        if (!closed.has(key)) {
          closed.add(key);
          const w = o.w + 1 + +(c === color) * 1000;
          open.push({ snake, w, parent: o, id: id++ });
        }
      }
    }
  }

  return null;
};

/**
 * compute the best tunnel to get to the cell and back to the outside ( best = less usage of <color> )
 *
 * notice that it's one of the best tunnels, more with the same score could exist
 */
export const getBestTunnel = (
  grid: Grid,
  outside: Outside,
  x: number,
  y: number,
  color: Color,
  snakeN: number,
) => {
  const c = { x, y };
  const snake0 = createSnakeFromCells(Array.from({ length: snakeN }, () => c));

  const one = getSnakeEscapePath(grid, outside, snake0, color);

  if (!one) return null;

  // get the position of the snake if it was going to leave the x,y cell
  const snakeICells = one.slice(0, snakeN);
  while (snakeICells.length < snakeN)
    snakeICells.push(snakeICells[snakeICells.length - 1]);
  const snakeI = createSnakeFromCells(snakeICells);

  // remove from the grid the colors that one eat
  const gridI = copyGrid(grid);
  for (const { x, y } of one) setEmptySafe(gridI, x, y);

  const two = getSnakeEscapePath(gridI, outside, snakeI, color);

  if (!two) return null;

  one.shift();
  one.reverse();
  one.push(...two);

  trimTunnelStart(grid, one);
  trimTunnelEnd(grid, one);

  return one;
};
