# diagrams

Small diagram-as-code CLI for generating SVG diagrams with `roughjs` (default), `clean-svg`, or `perfect-freehand` + `jsdom`.

## Requirements

- Node.js 18+ (recommended: current LTS)
- npm

## Install

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

List available diagrams:

```bash
npm run convert -- --list
```

Render a diagram to `out/<name>.svg`:

```bash
npm run convert -- empty-rect
```

Render a diagram to `out/<name>.png`:

```bash
npm run convert -- empty-rect --png
```

Print SVG to stdout:

```bash
npm run convert -- empty-rect --stdout
```

Set a custom output directory:

```bash
npm run convert -- empty-rect --outDir ./artifacts
```

Render with `perfect-freehand` instead of the default renderer:

```bash
npm run convert -- empty-rect --renderer perfect-freehand
```

Render with clean geometry:

```bash
npm run convert -- empty-rect --renderer clean-svg
```

Render with the synthwave theme (includes neon glow filters):

```bash
npm run convert -- empty-rect --theme synthwave
```

## CLI options

- `--list` - list available diagrams
- `--stdout` - print SVG to stdout instead of writing a file
- `--png` - export PNG instead of SVG
- `--outDir <dir>` - output directory (default: `out`)
- `--renderer <name>` - renderer backend: `roughjs` (default), `clean-svg`, or `perfect-freehand`
- `--theme <name>` - theme preset: `classic` (default) or `synthwave`

## PNG conversion notes

PNG export is rendered with `@resvg/resvg-js` for consistent output across environments.

## Project structure

- `src/converter.ts` - CLI entrypoint
- `src/diagrams/` - diagram definitions
- `src/render/` - rendering and drawing primitives
- `dist/` - compiled output (generated)
- `out/` - generated output files such as SVG/PNG (generated)
