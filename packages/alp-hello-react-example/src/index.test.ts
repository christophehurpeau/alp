import { spawnSync } from 'child_process';
import { createRequire } from 'module';
// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';
import type { Daemon } from 'springbokjs-daemon';
// eslint-disable-next-line import/no-extraneous-dependencies
import { createDaemon } from 'springbokjs-daemon';

describe('test hello server', () => {
  let daemon: Daemon;

  beforeAll(async () => {
    const cwd = new URL('../', import.meta.url).pathname;
    const require = createRequire(import.meta.url);

    spawnSync(process.argv0, [require.resolve('next/dist/bin/next'), 'build'], {
      cwd,
      env: {
        TEST_BUILD_ID: 'test-build-id',
      },
      stdio: 'inherit',
    });

    daemon = createDaemon({
      command: require.resolve('next/dist/bin/next'),
      cwd,
      args: ['start', '--port', 5555],
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

  test('hello without name', async () => {
    const result = await fetch('http://localhost:5555/').then((res) =>
      res.text(),
    );
    expect(result).toMatchSnapshot();
  });

  test('hello with name', async () => {
    const result = await fetch('http://localhost:5555/?name=Chris').then(
      (res) => res.text(),
    );
    expect(result).toMatchSnapshot();
  });
});
