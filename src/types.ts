// 底层类型与网格/蛇操作，合并自原 @snk/types 的 grid / snake / point 三文件。
// 网格以扁平 Uint8Array 存储，索引 = x * height + y（列主序）。

export type Point = { x: number; y: number };

export const around4 = [
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
  { x: 0, y: 1 },
] as const;

export const pointEquals = (a: Point, b: Point) => a.x === b.x && a.y === b.y;

export type Color = (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9) & { _tag: "__Color__" };
export type Empty = 0 & { _tag: "__Empty__" };

export type Grid = {
  width: number;
  height: number;
  data: Uint8Array;
};

export const isGrid = (x: any): x is Grid =>
  !!x &&
  typeof x?.width === "number" &&
  typeof x?.height === "number" &&
  x.data?.length <= x.width * x.height;

export const isInside = (grid: Grid, x: number, y: number) =>
  x >= 0 && y >= 0 && x < grid.width && y < grid.height;

export const isInsideLarge = (grid: Grid, m: number, x: number, y: number) =>
  x >= -m && y >= -m && x < grid.width + m && y < grid.height + m;

export const copyGrid = ({ width, height, data }: Grid) => ({
  width,
  height,
  data: Uint8Array.from(data),
});

const getIndex = (grid: Grid, x: number, y: number) => x * grid.height + y;

export const getColor = (grid: Grid, x: number, y: number) =>
  grid.data[getIndex(grid, x, y)] as Color | Empty;

export const isEmpty = (color: Color | Empty): color is Empty => color === 0;

export const setColor = (
  grid: Grid,
  x: number,
  y: number,
  color: Color | Empty,
) => {
  grid.data[getIndex(grid, x, y)] = color || 0;
};

export const setColorEmpty = (grid: Grid, x: number, y: number) => {
  setColor(grid, x, y, 0 as Empty);
};

export const isGridEmpty = (grid: Grid) => grid.data.every((x) => x === 0);

export const gridEquals = (a: Grid, b: Grid) =>
  a.data.every((_, i) => a.data[i] === b.data[i]);

export const createEmptyGrid = (width: number, height: number) => ({
  width,
  height,
  data: new Uint8Array(width * height),
});

export type Snake = Uint8Array & { _tag: "__Snake__" };

export const getHeadX = (snake: Snake) => snake[0] - 2;
export const getHeadY = (snake: Snake) => snake[1] - 2;

export const getSnakeLength = (snake: Snake) => snake.length / 2;

export const copySnake = (snake: Snake) => snake.slice() as Snake;

export const snakeEquals = (a: Snake, b: Snake) => {
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};

export const nextSnake = (snake: Snake, dx: number, dy: number) => {
  const copy = new Uint8Array(snake.length);
  for (let i = 2; i < snake.length; i++) copy[i] = snake[i - 2];
  copy[0] = snake[0] + dx;
  copy[1] = snake[1] + dy;
  return copy as Snake;
};

export const snakeWillSelfCollide = (snake: Snake, dx: number, dy: number) => {
  const nx = snake[0] + dx;
  const ny = snake[1] + dy;

  for (let i = 2; i < snake.length - 2; i += 2)
    if (snake[i + 0] === nx && snake[i + 1] === ny) return true;

  return false;
};

export const snakeToCells = (snake: Snake): Point[] =>
  Array.from({ length: snake.length / 2 }, (_, i) => ({
    x: snake[i * 2 + 0] - 2,
    y: snake[i * 2 + 1] - 2,
  }));

export const createSnakeFromCells = (points: Point[]) => {
  const snake = new Uint8Array(points.length * 2);
  for (let i = points.length; i--; ) {
    snake[i * 2 + 0] = points[i].x + 2;
    snake[i * 2 + 1] = points[i].y + 2;
  }
  return snake as Snake;
};
