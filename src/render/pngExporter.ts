import { Resvg } from "@resvg/resvg-js";

const DEFAULT_FONT_FAMILY = "Comic Sans MS";

export async function exportSvgToPng(svg: string): Promise<Buffer> {
  const renderer = new Resvg(svg, {
    font: {
      loadSystemFonts: true,
      defaultFontFamily: DEFAULT_FONT_FAMILY,
      sansSerifFamily: DEFAULT_FONT_FAMILY
    }
  });
  const rendered = renderer.render();
  return Buffer.from(rendered.asPng());
}
