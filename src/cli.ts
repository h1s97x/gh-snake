import * as fs from "node:fs";
import * as path from "node:path";
import { generateSnakeAnimation } from "./generate";
import { parseOutputsOption } from "./outputsOptions";

// 极简 GitHub Action 输入读取（替代 @actions/core 的 getInput/setFailed）
const getInput = (name: string) =>
  process.env[`INPUT_${name.replace(/ /g, "_").toUpperCase()}`] || "";

const parseArgs = (argv: string[]) => {
  const args: Record<string, string | string[]> = {};
  for (let i = 2; i < argv.length; i++) {
    const m = argv[i].match(/^--([^=]+)(?:=(.*))?$/);
    if (!m) continue;
    const key = m[1];
    const val = m[2] ?? "";
    const cur = args[key];
    if (Array.isArray(cur)) cur.push(val);
    else if (cur !== undefined) args[key] = [cur, val];
    else args[key] = val;
  }
  return args;
};

const main = async () => {
  const args = parseArgs(process.argv);

  const userName =
    (typeof args.github_user === "string" ? args.github_user : undefined) ||
    getInput("github_user_name");

  const githubToken =
    (typeof args.github_token === "string" ? args.github_token : undefined) ||
    process.env.GITHUB_TOKEN ||
    getInput("github_token") ||
    "";

  const baseUrl = typeof args.base_url === "string" ? args.base_url : undefined;

  const outputArgs: string[] = Array.isArray(args.output)
    ? args.output
    : typeof args.output === "string"
      ? [args.output]
      : [];

  // 既支持 `bun src/cli.ts --output=...`（可多次）也支持 Action 的 INPUT_OUTPUTS
  const outputsRaw = [
    ...outputArgs,
    ...(getInput("outputs") || "").split("\n"),
    getInput("svg_out_path"), // 兼容旧字段
  ]
    .map((x) => (x ?? "").trim())
    .filter(Boolean);

  if (!userName)
    throw new Error(
      "github_user_name is required (arg --github_user or INPUT_GITHUB_USER_NAME)",
    );

  const outputs = parseOutputsOption(outputsRaw);

  const results = await generateSnakeAnimation(
    { platform: "github", username: userName, githubToken, baseUrl },
    outputs,
  );

  outputs.forEach((out, i) => {
    const result = results[i];
    if (out?.filename && result) {
      console.log(`writing to ${out.filename}`);
      fs.mkdirSync(path.dirname(out.filename), { recursive: true });
      fs.writeFileSync(out.filename, result);
    }
  });
};

main().catch((e) => {
  console.error(`::error::${e?.message ?? e}`);
  process.exit(1);
});
