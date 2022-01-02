// eslint-disable-next-line import/no-extraneous-dependencies
import fetch from 'node-fetch';
import type { Daemon } from 'springbokjs-daemon';
import { createDaemon } from 'springbokjs-daemon';

describe('test hello server', () => {
  let daemon: Daemon;

  beforeAll(async () => {
    daemon = createDaemon({
      command: 'node',
      cwd: new URL('../', import.meta.url).pathname,
      args: ['build/index.mjs', '--port', 5555, '--version', 'test'],
    });
    await daemon.start();
  });

  afterAll(async () => {
    await daemon.stop();
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
