import './configure-logger';
import { execSync } from 'child_process';
import path from 'path';
import { URL } from 'url';
import * as colorette from 'colorette';
import argv from 'minimist-argv';
import { Logger, addConfig, Level } from 'nightingale';
import formatterANSI from 'nightingale-ansi-formatter';
import { ConsoleHandler } from 'nightingale-console';
import portscanner from 'portscanner';
import ProgressBar from 'progress';
import type { Daemon } from 'springbokjs-daemon';
import createChild from 'springbokjs-daemon';
// import watchServer from './server';
import * as configBuild from './config-build';

const https = false;
const startProxyPort: number = (argv.browserSyncStartPort as number) || 3000;
const startAppPort: number = (argv.startAppPort as number) || 3050;
const endProxyPort: number = startProxyPort + 49;
const endAppPort: number = startAppPort + 49;

const logger = new Logger('alp-dev:watch', 'alp-dev');

execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);

let nodeChild: Daemon | undefined;

const bar = new ProgressBar(
  `${colorette.bold(colorette.yellow('Building...'))} ${colorette.bold(
    ':percent',
  )} [:bar] → :msg`,
  {
    incomplete: ' ',
    complete: '▇',
    total: 100,
    width: 1024, // max width possible
    clear: true,
    stream: process.stdout,
  },
);

const output = (param: string | string[]): void => {
  if (bar.complete) {
    process.stdout.write(`${param as string}\n`);
  } else {
    bar.interrupt(param as string);
  }
};

const formatterSimplified: typeof formatterANSI = ({
  key,
  datetime,
  ...restRecord
}) => formatterANSI(restRecord as Parameters<typeof formatterANSI>[0]);

addConfig(
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleHandler(Level.NOTICE, { output }),
    stop: true,
  },
  true,
);

addConfig(
  {
    pattern: /^alp-dev/,
    handler: new ConsoleHandler(Level.INFO, { output }),
    stop: true,
  },
  true,
);

addConfig(
  {
    pattern: /^springbokjs-daemon:alp-dev:watch:output/,
    handler: new ConsoleHandler(Level.INFO, {
      output,
      formatter: formatterSimplified,
    }),
    stop: true,
  },
  true,
);

const [proxyPort, port] = await Promise.all([
  portscanner.findAPortNotInUse(startProxyPort, endProxyPort),
  portscanner.findAPortNotInUse(startAppPort, endAppPort),
  configBuild.build('./src/config', () => {
    logger.warn('Config changed, restarting server');
    if (nodeChild) nodeChild.sendSIGUSR2();
  }),
]);
if (proxyPort === port) {
  throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
}

const building = { node: true, browser: true };
const percentages = { node: 0, browser: 0 };

const handleMessage = (
  source: 'node' | 'browser',
  msg:
    | 'ready'
    | { type: 'webpack-progress'; percentage: number; message: string }
    | any,
): void => {
  if (msg === 'ready') {
    building[source] = false;
    //
    // if (Object.values(building).every(Boolean)) {
    // }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (msg && msg.type === 'webpack-progress') {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    percentages[source] = msg.percentage;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const message: string = msg.message;
    bar.update((percentages.node + percentages.browser) / 2, {
      msg: message.length > 20 ? `${message.slice(0, 20)}...` : message,
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (msg && msg.type === 'failed-to-compile') {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    logger.fatal(`Failed to compile ${msg.bundleName}:\n${msg.errors}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (msg && msg.type === 'compiled-with-arnings') {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    logger.fatal(`Failed to compile ${msg.bundleName}:\n${msg.warnings}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  } else if (msg && msg.type === 'compiled-successfully') {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-member-access
    logger.success(`Compiled ${msg.bundleName} successfully!`);
  }
};

nodeChild = createChild({
  key: 'alp-dev:watch:watch-server',
  displayName: 'alp-dev:watch-server',
  prefixStdout: true,
  outputKey: 'alp-dev:watch:output:watch-server',
  outputDisplayName: 'SERVER:',
  autoRestart: true,
  args: [
    new URL(import.meta.url).pathname.replace('/watch-', '/watch-node-'),
    '--port',
    port,
  ],
  env: {
    ...process.env,
    NIGHTINGALE_CONSOLE_FORMATTER: 'ansi',
  },
  onMessage: (msg) => {
    handleMessage('node', msg);
  },
});

const browserChild = createChild({
  key: 'alp-dev:watch:watch-browser',
  displayName: 'alp-dev:watch-browser',
  autoRestart: true,
  args: [
    new URL(import.meta.url).pathname.replace('/watch-', '/watch-browser-'),
    '--port',
    port,
    '--proxy-port',
    proxyPort,
    '--host',
    argv.host || '',
  ],
  env: {
    ...process.env,
    NIGHTINGALE_CONSOLE_FORMATTER: 'ansi',
  },
  onMessage: (msg) => {
    handleMessage('browser', msg);
  },
});

const cleanup = (): void => {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  Promise.all([
    nodeChild?.stop().catch((err) => {}),
    browserChild?.stop().catch((err) => {}),
  ]).then(() => {
    process.exit(0);
  });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

await Promise.all([nodeChild.start(), browserChild.start()]);
const url = `http${https ? 's' : ''}://localhost:${proxyPort}`;
logger.success(`Your application is running here: ${url}`);
