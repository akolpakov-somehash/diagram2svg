# Repository Guidelines

## Project Structure & Module Organization
Source code lives in `src/` and compiles to `dist/` via TypeScript.
- `src/converter.ts`: CLI entrypoint (`converter`) and argument parsing.
- `src/diagrams/`: diagram definitions and registry (`index.ts`).
- `src/render/`: renderer implementations and shared rendering types.
- `out/`: generated SVG outputs from local runs.

Treat `dist/` and `out/` as generated artifacts; edit files in `src/` only.

## Build, Test, and Development Commands
- `npm install`: install dependencies (Node.js 18+ recommended).
- `npm run build`: compile TypeScript from `src/` to `dist/`.
- `npm run watch`: rebuild automatically while developing.
- `npm run convert -- --list`: list available diagram IDs.
- `npm run convert -- empty-rect`: render a diagram to `out/empty-rect.svg`.
- `npm run convert -- empty-rect --stdout`: print SVG to stdout for quick checks.

Run `npm run build` before opening a PR.

## Coding Style & Naming Conventions
Use strict TypeScript patterns consistent with the existing codebase:
- 2-space indentation, semicolons, and double-quoted strings.
- Prefer explicit types at boundaries (CLI options, renderer names, exported APIs).
- Keep functions small and focused; use clear error messages for CLI failures.
- Avoid magic numbers; extract meaningful numeric literals into named `const` values (for example spacing, dimensions, and thresholds).
- File names in `src/diagrams/` and diagram IDs use kebab-case (example: `empty-rect`, `two-arrays-sample`).

No dedicated formatter/linter is currently configured; keep style aligned with surrounding code and run `npm run build` to catch type issues.

## Testing Guidelines
There is no automated test framework configured yet. For now, validate changes with:
1. `npm run build`
2. One or more CLI smoke checks (for example `--list`, default render, and `--renderer perfect-freehand`).

If you add tests, place them near the related module and wire a project-level `npm test` script in `package.json`.

## Commit & Pull Request Guidelines
Use concise, imperative commit subjects matching project history (examples: `Add array diagrams...`, `Refine two arrays sample...`).

For PRs, include:
- a brief summary of behavior changes,
- related issue/context,
- exact commands used for verification,
- sample output paths (or SVG screenshots) when visual output changes.
