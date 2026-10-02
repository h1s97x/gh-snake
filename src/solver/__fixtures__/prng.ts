// tiny deterministic PRNG (LCG) — dependency-free stand-in for park-miller,
// used only by test fixtures to build random contribution grids.
export const createRandom = (seed: number) => {
  let s = seed >>> 0 || 1;
  const next = () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s;
  };
  return {
    integerInRange: (min: number, max: number) =>
      min + (next() % (max - min + 1)),
  };
};
