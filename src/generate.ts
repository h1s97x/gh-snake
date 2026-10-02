import type { DrawOptions } from "./render/index";
import { getGithubUserContribution } from "./github";
import { getBestRoute } from "./solver/getBestRoute";
import { getPathToPose } from "./solver/getPathToPose";
import { snake4 } from "./snake";
import { cellsToGrid } from "./cellsToGrid";

export { basePalettes, palettes } from "./palettes";

export type Source = {
  platform: "github";
  username: string;
  githubToken: string;
  baseUrl?: string;
};

export type AnimationOptions = { stepDurationMs: number };
export type Output = {
  drawOptions: DrawOptions;
  animationOptions: AnimationOptions;
};

export const generateSnakeAnimation = async (
  source: Source,
  outputs: (Output | null)[],
) => {
  console.log(`🎣 fetching user contribution from ${source.platform}`);
  const cells = await getGithubUserContribution(source.username, {
    githubToken: source.githubToken,
    baseUrl: source.baseUrl,
  });
  const grid = cellsToGrid(cells);
  const snake = snake4;

  console.log("📡 computing best route");
  const chain = getBestRoute(grid, snake)!;
  chain.push(...getPathToPose(chain.slice(-1)[0], snake)!);

  return Promise.all(
    outputs.map(async (out, i) => {
      if (!out) return;
      const { drawOptions, animationOptions } = out;
      console.log(`🖌 creating svg (outputs[${i}])`);
      const { createSvg } = await import("./render/index");
      return createSvg(grid, cells, chain, drawOptions, animationOptions);
    }),
  );
};
