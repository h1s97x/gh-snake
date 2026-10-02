import { expect, it } from "bun:test";
import * as fs from "fs";
import * as path from "path";
import { generateSnakeAnimation } from "../generate";
import { parseOutputsOption } from "../outputsOptions";

const silent = (handler: () => void | Promise<void>) => async () => {
  const originalConsoleLog = console.log;
  console.log = () => undefined;
  try {
    return await handler();
  } finally {
    console.log = originalConsoleLog;
  }
};

it(
  "should generate contribution snake",
  silent(async () => {
    const entries = [
      path.join(__dirname, "__snapshots__/out.svg"),

      path.join(__dirname, "__snapshots__/out-dark.svg") +
        "?palette=github-dark&color_snake=orange",
    ];

    const outputs = parseOutputsOption(entries);

    const results = await generateSnakeAnimation(
      {
        platform: "github",
        username: "h1s97x",
        githubToken: process.env.GITHUB_TOKEN!,
      },
      outputs,
    );

    expect(results[0]).toBeDefined();
    expect(results[1]).toBeDefined();

    fs.writeFileSync(outputs[0]!.filename, results[0]!);
    fs.writeFileSync(outputs[1]!.filename, results[1]!);
  }),
  { timeout: 2 * 60 * 1000 },
);
