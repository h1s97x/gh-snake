import { createRandom } from "./prng";
import { Color, createEmptyGrid } from "../../types";
import { randomlyFillGrid } from "./randomlyFillGrid";

export const createFromSeed = (seed: number, width = 5, height = 5) => {
  const grid = createEmptyGrid(width, height);
  const pm = createRandom(seed);
  const random = pm.integerInRange.bind(pm);
  randomlyFillGrid(grid, { colors: [1, 2] as Color[], emptyP: 2 }, random);
  return grid;
};
