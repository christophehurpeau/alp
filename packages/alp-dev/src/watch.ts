import './configure-logger';
import { execSync } from 'child_process';
import path from 'path';
import Logger, { addConfig, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';
import formatterANSI from 'nightingale-ansi-formatter';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild, { Daemon } from 'springbokjs-daemon';
import colorette from 'colorette';
import ProgressBar from 'progress';
// import watchServer from './server';
import * as configBuild from './config-build';

const startProxyPort: number = argv.browserSyncStartPort || 3000;
const startAppPort: number = argv.startAppPort || 3050;
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

const formatterSimplified: any = ({ key, datetime, ...restRecord }: any) =>
  formatterANSI(restRecord);

addConfig(
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleLogger(Level.NOTICE, { output }),
    stop: true,
  },
  true,
);

addConfig(
  {
    pattern: /^alp-dev/,
    handler: new ConsoleLogger(Level.INFO, { output }),
    stop: true,
  },
  true,
);

addConfig(
  {
    pattern: /^springbokjs-daemon:alp-dev:watch:output/,
    handler: new ConsoleLogger(Level.INFO, {
      output,
      formatter: formatterSimplified,
    }),
    stop: true,
  },
  true,
);

Promise.all([
  portscanner.findAPortNotInUse(startProxyPort, endProxyPort),
  portscanner.findAPortNotInUse(startAppPort, endAppPort),
  configBuild.build('./src/config', () => {
    logger.warn('config changed, restarting server');
    if (nodeChild) nodeChild.sendSIGUSR2();
  }),
])
  .then(([proxyPort, port]: [number, number, void]) => {
    if (proxyPort === port) {
      throw new Error(
        `"proxyPort" and "port" cannot have the same value: ${port}`,
      );
    }

    const building = { node: true, browser: true };
    const percentages = { node: 0, browser: 0 };

    const handleMessage = (
      source: 'node' | 'browser',
      msg:
        | 'ready'
        | { type: 'webpack-progress'; percentage: number; message: string }
        | any,
    ) => {
      if (msg === 'ready') {
        building[source] = false;
        //
        // if (Object.values(building).every(Boolean)) {
        // }
      } else if (msg && msg.type === 'webpack-progress') {
        percentages[source] = msg.percentage;
        const message = msg.message;
        bar.update((percentages.node + percentages.browser) / 2, {
          msg: message.length > 20 ? `${message.substr(0, 20)}...` : message,
        });
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
        require.resolve(__filename.replace('/watch-', '/watch-node-')),
        '--port',
        port,
      ],
      env: {
        ...process.env,
        NIGHTINGALE_CONSOLE_FORMATTER: 'ansi',
      },
      onMessage: (msg) => handleMessage('node', msg),
    });

    const browserChild = createChild({
      key: 'alp-dev:watch:watch-browser',
      displayName: 'alp-dev:watch-browser',
      autoRestart: true,
      args: [
        require.resolve(__filename.replace('/watch-', '/watch-browser-')),
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
      onMessage: (msg) => handleMessage('browser', msg),
    });

    Promise.all([nodeChild.start(), browserChild.start()]).then(() => {
      logger.success('ready', { port: proxyPort, serverPort: port });
    });
  })
  .catch((err) => console.log(err.stack));
