# diagrams

Small diagram-as-code CLI for generating SVG diagrams with `roughjs` + `jsdom`.

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

Render another diagram:

```bash
npm run convert -- median-partition
```

Print SVG to stdout:

```bash
npm run convert -- median-partition --stdout
```

Set a custom output directory:

```bash
npm run convert -- empty-rect --outDir ./artifacts
```

## CLI options

- `--list` - list available diagrams
- `--stdout` - print SVG to stdout instead of writing a file
- `--outDir <dir>` - output directory (default: `out`)

## Project structure

- `src/converter.ts` - CLI entrypoint
- `src/diagrams/` - diagram definitions
- `src/render/` - rendering and drawing primitives
- `dist/` - compiled output (generated)
- `out/` - generated SVG files (generated)
