import { promises as fs } from "node:fs";
import path from "node:path";
import { Command } from "commander";
import { getDiagram, listDiagrams } from "./diagrams";
import { renderDiagramToSvg as renderWithFreehand } from "./render/freehandSvgRenderer";
import { exportSvgToPng } from "./render/pngExporter";
import { renderDiagramToSvg as renderWithRoughjs } from "./render/roughjsSvgRenderer";
import { DEFAULT_THEME_NAME, getThemeByName, parseThemeName, THEME_NAMES, type ThemeName } from "./render/theme";

interface CliOptions {
  outDir: string;
  stdout?: boolean;
  list?: boolean;
  png?: boolean;
  renderer: string;
  theme: string;
}

const SUPPORTED_RENDERERS = ["perfect-freehand", "roughjs"] as const;
type RendererName = (typeof SUPPORTED_RENDERERS)[number];

function parseRenderer(value: string): RendererName | null {
  return (SUPPORTED_RENDERERS as readonly string[]).includes(value) ? (value as RendererName) : null;
}

function renderByRenderer(renderer: RendererName, diagram: ReturnType<typeof getDiagram>, themeName: ThemeName): string {
  if (!diagram) {
    throw new Error("Diagram is required.");
  }

  const theme = getThemeByName(themeName);

  if (renderer === "roughjs") {
    return renderWithRoughjs(diagram, { theme });
  }

  return renderWithFreehand(diagram, { theme });
}

async function run(diagramName: string | undefined, options: CliOptions): Promise<number> {
  const names = listDiagrams();

  if (options.list) {
    process.stdout.write(`${names.join("\n")}\n`);
    return 0;
  }

  if (!diagramName) {
    process.stderr.write("Missing diagram name. Use --list to see available diagrams.\n");
    return 1;
  }

  const diagram = getDiagram(diagramName);
  if (!diagram) {
    process.stderr.write(`Unknown diagram "${diagramName}".\n`);
    return 1;
  }

  const renderer = parseRenderer(options.renderer);
  if (!renderer) {
    process.stderr.write(
      `Unknown renderer "${options.renderer}". Allowed values: ${SUPPORTED_RENDERERS.join(", ")}.\n`
    );
    return 1;
  }

  const theme = parseThemeName(options.theme);
  if (!theme) {
    process.stderr.write(`Unknown theme "${options.theme}". Allowed values: ${THEME_NAMES.join(", ")}.\n`);
    return 1;
  }

  const svg = renderByRenderer(renderer, diagram, theme);
  const outputExtension = options.png ? "png" : "svg";

  if (options.stdout) {
    if (options.png) {
      const png = await exportSvgToPng(svg);
      process.stdout.write(png);
      return 0;
    }

    process.stdout.write(svg);
    return 0;
  }

  await fs.mkdir(options.outDir, { recursive: true });
  const outputPath = path.join(options.outDir, `${diagramName}.${outputExtension}`);

  if (options.png) {
    const png = await exportSvgToPng(svg);
    await fs.writeFile(outputPath, png);
  } else {
    await fs.writeFile(outputPath, svg, "utf8");
  }

  process.stdout.write(`${outputPath}\n`);
  return 0;
}

async function main(): Promise<void> {
  const program = new Command();

  program
    .name("converter")
    .usage("<diagram-name> [options]")
    .argument("[diagram-name]")
    .option("--outDir <dir>", "output directory", "out")
    .option("--stdout", "print SVG to stdout instead of writing a file")
    .option("--list", "list available diagrams")
    .option("--png", "export PNG instead of SVG")
    .option(
      "--renderer <name>",
      `renderer backend (${SUPPORTED_RENDERERS.join(" | ")})`,
      "roughjs"
    )
    .option("--theme <name>", `theme preset (${THEME_NAMES.join(" | ")})`, DEFAULT_THEME_NAME)
    .action(async (diagramName: string | undefined, options: CliOptions) => {
      const exitCode = await run(diagramName, options);
      process.exitCode = exitCode;
    });

  await program.parseAsync(process.argv);
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`Error: ${message}\n`);
  process.exitCode = 1;
});
