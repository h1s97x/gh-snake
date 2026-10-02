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
    srcset="https://raw.githubusercontent.com/h1s97x/gh-snake/output/github-contribution-grid-snake-dark.svg"
  />
  <source
    media="(prefers-color-scheme: light)"
    srcset="https://raw.githubusercontent.com/h1s97x/gh-snake/output/github-contribution-grid-snake.svg"
  />
  <img
    alt="github contribution grid snake animation"
    src="https://raw.githubusercontent.com/h1s97x/gh-snake/output/github-contribution-grid-snake.svg"
  />
</picture>

Pull a github user's contribution graph.
Make it a snake Game, generate a snake path where the cells get eaten in an orderly fashion.

Generate an [svg](https://github.com/h1s97x/gh-snake/raw/output/github-contribution-grid-snake.svg) image. Colors can [be](https://raw.githubusercontent.com/h1s97x/gh-snake/output/github-contribution-grid-snake-ocean.svg) [customized](https://raw.githubusercontent.com/h1s97x/gh-snake/output/github-contribution-grid-snake-grey.svg).

Available as github action. It can automatically generate a new image each day. Which makes for great [github profile readme](https://docs.github.com/en/free-pro-team@latest/github/setting-up-and-managing-your-github-profile/managing-your-profile-readme)

## Usage

### **github action**

```yaml
- uses: h1s97x/gh-snake@main
  with:
    # github user name to read the contribution graph from (**required**)
    # using action context var `github.repository_owner` or specified user
    github_user_name: ${{ github.repository_owner }}

    # list of files to generate.
    # one file per line. Each output can be customized with options as query string.
    #
    #  supported options:
    #  - palette:           A preset of color, one of [github, github-dark, github-light]
    #  - color_snake:       Color of the snake
    #  - color_dots:        Coma separated list of dots color.
    #                       The first one is 0 contribution, then it goes from the low contribution to the highest.
    #                       Exactly 5 colors are expected.
    outputs: |
      dist/github-snake.svg
      dist/github-snake-dark.svg?palette=github-dark
      dist/ocean.svg?color_snake=orange&color_dots=#bfd6f6,#8dbdff,#64a1f4,#4b91f1,#3c7dd9
```

[example with cron job](https://github.com/h1s97x/gh-snake/blob/main/.github/workflows/snake.yml)

### **dark mode**

![dark mode](https://github.com/user-attachments/assets/6b900b64-0cdc-43f0-a234-e11dba8e786e)

For **dark mode** support on github, use this [special syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#specifying-the-theme-an-image-is-shown-to) in your readme.

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="github-snake-dark.svg" />
  <source media="(prefers-color-scheme: light)" srcset="github-snake.svg" />
  <img alt="github-snake" src="github-snake.svg" />
</picture>
```

## Implementation

[solver algorithm](./src/solver/README.md)

## Contributing

Contributions are welcome! This project is open to issues, feature requests, and pull requests.

- **Issues**: open an issue for bugs or ideas.
- **Pull requests**: fork the repo, make your change on a branch, and open a PR against `main`. Keep changes focused and add or update tests where relevant.
- Larger changes are welcome too — open an issue first if you'd like to discuss direction.

## License

Distributed under the [MIT License](./LICENSE).
