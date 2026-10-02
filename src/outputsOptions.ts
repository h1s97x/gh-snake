import type { DrawOptions } from "./render/index";
import { palettes } from "./palettes";

export type AnimationOptions = { stepDurationMs: number };
export type Output = {
  filename: string;
  drawOptions: DrawOptions;
  animationOptions: AnimationOptions;
};

export const parseOutputsOption = (lines: string[]) => lines.map(parseEntry);

export const parseEntry = (entry: string): Output | null => {
  const m = entry.trim().match(/^(.+\.svg)(\?(.*)|\s*({.*}))?$/);

  if (!m) return null;

  const [, filename, , q1, q2] = m;

  const query = q1 ?? q2;

  let sp = new URLSearchParams(query || "");

  try {
    const o = JSON.parse(query);

    if (Array.isArray(o.color_dots)) o.color_dots = o.color_dots.join(",");

    sp = new URLSearchParams(o);
  } catch (err) {
    if (!(err instanceof SyntaxError)) throw err;
  }

  const drawOptions: DrawOptions = {
    sizeDotBorderRadius: 0,
    sizeCell: 16,
    sizeDot: 12,
    ...palettes["default"],
  };
  const animationOptions: AnimationOptions = {
    stepDurationMs: 100,
  };

  {
    const palette = palettes[sp.get("palette") as keyof typeof palettes];
    if (palette) {
      Object.assign(drawOptions, palette);
    }
  }

  if (sp.has("color_dots")) {
    const colors = sp.get("color_dots")!.split(/[,;]/);
    drawOptions.colorDots = colors;
    drawOptions.colorEmpty = colors[0];
  }
  if (sp.has("color_snake")) drawOptions.colorSnake = sp.get("color_snake")!;
  if (sp.has("color_dot_border"))
    drawOptions.colorDotBorder = sp.get("color_dot_border")!;

  return {
    filename,
    drawOptions,
    animationOptions,
  };
};
