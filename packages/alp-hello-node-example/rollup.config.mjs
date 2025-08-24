import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import createRollupConfig from "@pob/rollup-esbuild/createRollupConfig.js";
import run from "@pob/rollup-esbuild/plugin-run.cjs";
import config from "alp-rollup-plugin-config";

const watch = process.env.ROLLUP_WATCH === "true";

export default createRollupConfig({
  cwd: dirname(fileURLToPath(import.meta.url)),
  outDirectory: "build",
  plugins: [
    config({
      targets: [{ src: "src/config/**/*.yml" }],
    }),
    watch && run({ execArgv: ["--enable-source-maps"] }),
  ],
});
