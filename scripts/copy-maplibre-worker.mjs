// maplibre-gl v6 loads its worker as a separate ES module resolved from
// import.meta.url, which breaks once bundled by Next. Serve the worker (and
// the shared chunk it imports) from /public instead.
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);
const distDir = join(dirname(require.resolve("maplibre-gl/package.json")), "dist");
const outDir = join(process.cwd(), "public", "maplibre");

mkdirSync(outDir, { recursive: true });

for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  copyFileSync(join(distDir, file), join(outDir, file));
}
