import { it, expect } from "bun:test";
import { createEmptyGrid } from "../../types";
import { getHeadX, getHeadY } from "../../types";
import { snake3 } from "../../snake";
import { getPathTo } from "../getPathTo";

it("should find it's way in vaccum", () => {
  const grid = createEmptyGrid(5, 0);

  const path = getPathTo(grid, snake3, 5, -1)!;

  expect([getHeadX(path[0]), getHeadY(path[0])]).toEqual([5, -1]);
});
