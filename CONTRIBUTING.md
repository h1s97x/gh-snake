# Contributing

Thanks for your interest in improving **snk**! This document explains how to
set up a development environment, run the project, and what to expect when you
open an issue or a pull request.

## Development setup

snk is built with [Bun](https://bun.sh). Generating a snake from a real
contribution graph also requires a GitHub token.

```bash
# install dependencies
bun install

# type-check
bun run type

# formatter / linter check
bun run lint

# run the test suite
bun test
```

## Generating a snake locally

The CLI reads `github_user_name` (and optionally `github_token`) from either
command-line flags or `INPUT_*` environment variables (GitHub Action style).

```bash
# via flags
bun src/cli.ts --github_user=<your-name> --github_token=<token> \
  --output=dist/github-snake.svg

# via Action-style environment variables
INPUT_GITHUB_USER_NAME=<your-name> \
INPUT_GITHUB_TOKEN=<token> \
INPUT_OUTPUTS=$'dist/github-snake.svg\ndist/github-snake-dark.svg?palette=github-dark' \
bun src/cli.ts
```

> Without a token the GitHub GraphQL API returns `401`, so a real generation
> needs a personal access token with read access to your contribution calendar.

## Project layout

- `src/cli.ts` — entry point (GitHub Action + CLI).
- `src/github.ts` — fetches the contribution calendar from the GitHub GraphQL API.
- `src/solver/` — computes the snake path that "eats" the contribution cells.
- `src/render/` — turns the grid + path into an animated SVG.
- `src/palettes.ts`, `src/outputsOptions.ts` — color / output configuration.

## Contribution policy

This project is conservative about changes to its public API and rendering
behavior, because the generated SVG is consumed by many profile READMEs.

- **Issues** are very welcome — bug reports and feature requests help a lot.
- **Pull requests** should be discussed in an issue first. API or rendering
  changes are unlikely to be merged without prior agreement, since they can
  break downstream consumers.
- Keep changes focused and add or adjust tests where relevant.

## Running the tests

Most tests are offline (they render synthetic grids). One integration test
fetches a real contribution graph and therefore needs `GITHUB_TOKEN` to pass.
