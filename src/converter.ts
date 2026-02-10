import { promises as fs } from "node:fs";
import path from "node:path";
import { Command } from "commander";
import { getDiagram, listDiagrams } from "./diagrams";
import { renderDiagramToSvg } from "./render/roughSvgRenderer";

interface CliOptions {
  outDir: string;
  stdout?: boolean;
  list?: boolean;
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

  const svg = renderDiagramToSvg(diagram);

  if (options.stdout) {
    process.stdout.write(svg);
    return 0;
  }

  await fs.mkdir(options.outDir, { recursive: true });
  const outputPath = path.join(options.outDir, `${diagramName}.svg`);
  await fs.writeFile(outputPath, svg, "utf8");
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
