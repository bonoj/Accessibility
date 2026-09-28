import { build } from "esbuild";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const src = resolve(root, "src");
const dist = resolve(root, "dist");

await mkdir(dist, { recursive: true });

const js = await build({
  entryPoints: [resolve(src, "main.js")],
  bundle: true,
  write: false,
  format: "iife",
  target: ["es2022"],
  minify: false,
  sourcemap: false,
  legalComments: "none"
});

const css = await build({
  entryPoints: [resolve(src, "styles.css")],
  bundle: true,
  write: false,
  target: ["es2022"],
  minify: false,
  sourcemap: false,
  loader: {
    ".png": "dataurl",
    ".jpg": "dataurl",
    ".jpeg": "dataurl",
    ".gif": "dataurl",
    ".svg": "dataurl",
    ".webp": "dataurl",
    ".woff": "dataurl",
    ".woff2": "dataurl"
  }
});

const shell = await readFile(resolve(src, "shell.html"), "utf8");
const jsText = js.outputFiles[0].text.replaceAll("</script", "<\\/script");
const cssText = css.outputFiles[0].text.replaceAll("</style", "<\\/style");

if (!shell.includes("<!-- ACCESSIBILITY:STYLE -->") ||
    !shell.includes("<!-- ACCESSIBILITY:SCRIPT -->")) {
  throw new Error("src/shell.html is missing required build markers.");
}

const commit = process.env.GITHUB_SHA || "local";
const built = shell
  .replace("<!-- ACCESSIBILITY:STYLE -->", `<style>\n${cssText}</style>`)
  .replace("<!-- ACCESSIBILITY:SCRIPT -->", `<script>\n${jsText}</script>`)
  .replaceAll("{{BUILD_COMMIT}}", commit);

await writeFile(resolve(dist, "index.html"), built, "utf8");
console.log(`Built dist/index.html (${Buffer.byteLength(built)} bytes) from ${commit}`);
