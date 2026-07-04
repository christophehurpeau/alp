"use strict";

const { glob, mkdir, readFile, writeFile } = require("node:fs/promises");
const path = require("node:path");
const { load } = require("js-yaml");

const buildDestPath = (srcPath, dest) => {
  const { dir, name } = path.parse(srcPath);
  const [, ...restSegments] = dir.split(path.sep);
  return path.join(dest, ...restSegments, `${name}.json`);
};

module.exports = (options) => {
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
        }),
      );
    },
  };
};
