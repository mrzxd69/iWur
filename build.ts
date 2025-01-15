import { build } from "bun";
import { globImportPlugin } from "bun-plugin-glob-import";

await build({
    entrypoints: ["src/index.ts"],
    outdir: "dist",
    target: "bun",
    plugins: [globImportPlugin()]
})