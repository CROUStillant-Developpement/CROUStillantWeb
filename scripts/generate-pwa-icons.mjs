// Generates the installable-app icons in public/icons from public/logo.png.
// Run by hand (`node scripts/generate-pwa-icons.mjs`) whenever the logo
// changes; the output is committed. sharp is the copy Next already installs
// for image optimisation.
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const source = join(process.cwd(), "public", "logo.png");
const outDir = join(process.cwd(), "public", "icons");
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
// Quantised: the upscaled logo is otherwise close to 0.5 MB at 512px.
const PNG = { palette: true, quality: 90, compressionLevel: 9 };

mkdirSync(outDir, { recursive: true });

const logo = (size) =>
  sharp(source).resize(size, size, { kernel: "lanczos3" }).png().toBuffer();

// Opaque square with the logo centred at `ratio` of the canvas.
const padded = async (size, ratio) =>
  sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: await logo(Math.round(size * ratio)) }])
    .png(PNG);

await sharp(await logo(192)).png(PNG).toFile(join(outDir, "icon-192.png"));
await sharp(await logo(512)).png(PNG).toFile(join(outDir, "icon-512.png"));
// Maskable icons are cropped to any shape; only the central 80% is guaranteed
// to stay visible, so the round logo sits inside it.
await (await padded(512, 0.72)).toFile(join(outDir, "icon-maskable-512.png"));
// iOS paints transparent pixels black, hence the opaque background.
await (await padded(180, 0.86)).toFile(join(outDir, "apple-touch-icon.png"));
