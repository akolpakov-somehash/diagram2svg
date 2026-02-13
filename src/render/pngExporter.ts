import { Resvg } from "@resvg/resvg-js";

const DEFAULT_FONT_FAMILY = "Comic Sans MS";

export interface ExportPngOptions {
  defaultFontFamily?: string;
}

function extractPrimaryFontFamily(fontFamily: string | undefined): string {
  if (!fontFamily) {
    return DEFAULT_FONT_FAMILY;
  }

  const primary = fontFamily.split(",")[0].trim();
  const unquoted = primary.replace(/^['"]|['"]$/g, "").trim();
  return unquoted || DEFAULT_FONT_FAMILY;
}

export async function exportSvgToPng(svg: string, options: ExportPngOptions = {}): Promise<Buffer> {
  const defaultFontFamily = extractPrimaryFontFamily(options.defaultFontFamily);
  const renderer = new Resvg(svg, {
    font: {
      loadSystemFonts: true,
      defaultFontFamily,
      sansSerifFamily: defaultFontFamily
    }
  });
  const rendered = renderer.render();
  return Buffer.from(rendered.asPng());
}
