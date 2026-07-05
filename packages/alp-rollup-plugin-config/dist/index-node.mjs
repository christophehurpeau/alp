import { readFile, mkdir, writeFile, glob } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'js-yaml';

const buildDestPath = (srcPath, dest) => {
  const { dir, name } = path.parse(srcPath);
  const [, ...restSegments] = dir.split(path.sep);
  return path.join(dest, ...restSegments, `${name}.json`);
};
function alpRollupPluginConfig(options) {
  let files = [];
  return {
    name: "alp-config",
    async buildStart() {
      files = [];
      for (const { src, dest = "build" } of options.targets) {
        for await (const srcPath of glob(src)) {
          this.addWatchFile(path.resolve(srcPath));
          files.push({ srcPath, destPath: buildDestPath(srcPath, dest) });
        }
      }
    },
    async buildEnd() {
      await Promise.all(
        files.map(async ({ srcPath, destPath }) => {
          const yamlContents = await readFile(srcPath, "utf8");
          await mkdir(path.dirname(destPath), { recursive: true });
          await writeFile(destPath, JSON.stringify(load(yamlContents)));
        })
      );
    }
  };
}

export { alpRollupPluginConfig as default };
//# sourceMappingURL=index-node.mjs.map
