/* eslint-disable @typescript-eslint/no-floating-promises */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { after, before, describe, test } from "node:test";
import type { Daemon } from "springbokjs-daemon";
import { createDaemon } from "springbokjs-daemon";

describe.skip("test hello server", () => {
  let daemon: Daemon;

  before(
    async () => {
      const cwd = new URL("../", import.meta.url).pathname;
      const require = createRequire(import.meta.url);

      spawnSync(
        process.argv0,
        [require.resolve("next/dist/bin/next"), "build"],
        {
          cwd,
          env: {
            NODE_ENV: "production",
            TEST_BUILD_ID: "test-build-id",
          },
          stdio: "inherit",
        },
      );

      daemon = createDaemon({
        command: require.resolve("next/dist/bin/next"),
        cwd,
        args: ["start", "--port", 5555],
      });

      // dont wait for daemonNext as next does not support process.send('ready')
      daemon.start().catch(console.error);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
    },
    { timeout: 120_000 },
  );

  after(async () => {
    if (daemon) await daemon.stop();
  });

  test("hello without name", async () => {
    const result = await fetch("http://localhost:5555/").then((res) =>
      res.text(),
    );
    assert.ok(result); //.toMatchSnapshot();
  });

  test("hello with name", async () => {
    const result = await fetch("http://localhost:5555/?name=Chris").then(
      (res) => res.text(),
    );
    assert.ok(result); //.toMatchSnapshot();
  });
});
