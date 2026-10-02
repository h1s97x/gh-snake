# snk

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/h1s97x/gh-snake/main.yml?label=action&style=flat-square)](https://github.com/h1s97x/gh-snake/actions/workflows/main.yml)
[![GitHub release](https://img.shields.io/github/release/h1s97x/gh-snake.svg?style=flat-square)](https://github.com/h1s97x/gh-snake/releases/latest)
[![GitHub marketplace](https://img.shields.io/badge/marketplace-snake-blue?logo=github&style=flat-square)](https://github.com/h1s97x/gh-snake)
![type definitions](https://img.shields.io/npm/types/typescript?style=flat-square)
![code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)

Generates a snake game from a github user contributions graph

<picture>
  <source
    media="(prefers-color-scheme: dark)"
    srcset="https://raw.githubusercontent.com/h1s97x/h1s97x/main/snake-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/h1s97x/h1s97x/main/snake.svg"
  />
  <img
    alt="github contribution grid snake animation"
    src="https://raw.githubusercontent.com/h1s97x/h1s97x/main/snake.svg"
  />
</picture>

Pull a github user's contribution graph.
Make it a snake Game, generate a snake path where the cells get eaten in an orderly fashion.

Generate an [svg](https://raw.githubusercontent.com/h1s97x/h1s97x/main/snake.svg) image. Colors can be customized via the `outputs` option (see the usage example below).

Available as github action. It can automatically generate a new image each day. Which makes for great [github profile readme](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme)

## Usage

### **github action**

Add a workflow to your profile repo (e.g. `.github/workflows/snake.yml`):

```yaml
on:
  schedule:
    - cron: "0 6 * * *" # every day
  workflow_dispatch:

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6

      - name: generate snake svg
        uses: h1s97x/gh-snake@main
        with:
          github_user_name: ${{ github.repository_owner }}
          outputs: |
            snake.svg
            snake-dark.svg?palette=github-dark

      - name: commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add snake.svg snake-dark.svg
          git commit -m "chore: update contribution snake" || exit 0
          git push
```

Then embed it in your `README.md`:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="snake.svg" />
  <img alt="github contribution snake" src="snake.svg" />
</picture>
```

[example with cron job](https://github.com/h1s97x/h1s97x/blob/main/.github/workflows/snake.yml)

### **dark mode**

![dark mode](https://github.com/user-attachments/assets/6b900b64-0cdc-43f0-a234-e11dba8e786e)

For **dark mode** support on github, use this [special syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to) in your readme (shown above).

## Implementation

[solver algorithm](./src/solver/README.md)

## Contributing

Contributions are welcome! This project is open to issues, feature requests, and pull requests.

- **Issues**: open an issue for bugs or ideas.
- **Pull requests**: fork the repo, make your change on a branch, and open a PR against `main`. Keep changes focused and add or update tests where relevant.
- Larger changes are welcome too — open an issue first if you'd like to discuss direction.

## License

Distributed under the [MIT License](./LICENSE).
