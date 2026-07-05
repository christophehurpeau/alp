import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, test } from "node:test";
// eslint-disable-next-line import-x/extensions
import alpRollupPluginConfig from "./index.ts";

let dir: string;
let originalCwd: string;

beforeEach(async () => {
  dir = await mkdtemp(path.join(tmpdir(), "alp-rollup-plugin-config-"));
  originalCwd = process.cwd();
  process.chdir(dir);
});

afterEach(async () => {
  process.chdir(originalCwd);
  await rm(dir, { recursive: true, force: true });
});

const runBuild = async (
  plugin: ReturnType<typeof alpRollupPluginConfig>,
): Promise<void> => {
  const watchedFiles: string[] = [];
  const context = { addWatchFile: (file: string) => watchedFiles.push(file) };
  await (
    plugin.buildStart as unknown as (this: typeof context) => Promise<void>
  ).call(context);
  await (plugin.buildEnd as unknown as () => Promise<void>)();
};

test("converts a yaml config file to json in the dest directory", async () => {
  await mkdir("config", { recursive: true });
  await writeFile(path.join("config", "app.yml"), "name: alp\nport: 3000\n");

  const plugin = alpRollupPluginConfig({
    targets: [{ src: path.join("config", "*.yml"), dest: "build" }],
  });

  await runBuild(plugin);

  const written = await readFile(path.join("build", "app.json"), "utf8");
  assert.deepEqual(JSON.parse(written), { name: "alp", port: 3000 });
});

test("preserves the source directory structure under dest", async () => {
  await mkdir(path.join("config", "nested"), { recursive: true });
  await writeFile(path.join("config", "nested", "sub.yml"), "enabled: true\n");

  const plugin = alpRollupPluginConfig({
    targets: [{ src: path.join("config", "**", "*.yml"), dest: "build" }],
  });

  await runBuild(plugin);

  const written = await readFile(
    path.join("build", "nested", "sub.json"),
    "utf8",
  );
  assert.deepEqual(JSON.parse(written), { enabled: true });
});

test("defaults dest to build when not provided", async () => {
  await mkdir("config", { recursive: true });
  await writeFile(path.join("config", "app.yml"), "name: alp\n");

  const plugin = alpRollupPluginConfig({
    targets: [{ src: path.join("config", "*.yml") }],
  });
  await runBuild(plugin);

  const written = await readFile(path.join("build", "app.json"), "utf8");
  assert.deepEqual(JSON.parse(written), { name: "alp" });
});

test("registers each matched source file as a watch file", async () => {
  await mkdir("config", { recursive: true });
  await writeFile(path.join("config", "a.yml"), "a: 1\n");
  await writeFile(path.join("config", "b.yml"), "b: 2\n");

  const watchedFiles: string[] = [];
  const plugin = alpRollupPluginConfig({
    targets: [{ src: path.join("config", "*.yml"), dest: "build" }],
  });
  const context = { addWatchFile: (file: string) => watchedFiles.push(file) };
  await (
    plugin.buildStart as unknown as (this: typeof context) => Promise<void>
  ).call(context);

  assert.deepEqual(
    watchedFiles.toSorted(),
    [
      path.resolve("config", "a.yml"),
      path.resolve("config", "b.yml"),
    ].toSorted(),
  );
});
