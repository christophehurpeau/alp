import './configure-logger';
import { execSync } from 'child_process';
import path from 'path';
import Logger from 'nightingale';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild, { Daemon } from 'springbokjs-daemon';
// import watchServer from './server';
import * as configBuild from './config-build';

const startProxyPort: number = argv.browserSyncStartPort || 3000;
const startAppPort: number = argv.startAppPort || 3050;
const endProxyPort: number = startProxyPort + 49;
const endAppPort: number = startAppPort + 49;

const logger = new Logger('alp-dev:watch', 'alp-dev');

execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);

let nodeChild: Daemon | undefined;

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

    nodeChild = createChild({
      key: 'alp-dev:watch:watch-node',
      displayName: 'alp-dev:watch-node',
      autoRestart: true,
      args: [
        require.resolve(__filename.replace('/watch-', '/watch-node-')),
        '--port',
        port,
      ],
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
    });

    Promise.all([nodeChild.start(), browserChild.start()]).then(() => {
      logger.success('ready', { port: proxyPort, serverPort: port });
    });
  })
  .catch((err) => console.log(err.stack));
