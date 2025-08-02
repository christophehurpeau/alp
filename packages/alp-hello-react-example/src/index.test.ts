import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import type { Daemon } from "springbokjs-daemon";
import { createDaemon } from "springbokjs-daemon";

xdescribe("test hello server", () => {
  let daemon: Daemon;

  beforeAll(async () => {
    const cwd = new URL("../", import.meta.url).pathname;
    const require = createRequire(import.meta.url);

    spawnSync(process.argv0, [require.resolve("next/dist/bin/next"), "build"], {
      cwd,
      env: {
        NODE_ENV: "production",
        TEST_BUILD_ID: "test-build-id",
      },
      stdio: "inherit",
    });

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
  }, 120_000);

  afterAll(async () => {
    if (daemon) await daemon.stop();
  });

  test("hello without name", async () => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const result = await fetch("http://localhost:5555/").then((res) =>
      res.text(),
    );
    expect(result).toBeTruthy(); //.toMatchSnapshot();
  });

  test("hello with name", async () => {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    const result = await fetch("http://localhost:5555/?name=Chris").then(
      (res) => res.text(),
    );
    expect(result).toBeTruthy(); //.toMatchSnapshot();
  });
});
