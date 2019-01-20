/* eslint-disable global-require */
import { execSync } from 'child_process';
import path from 'path';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild, { Daemon } from 'springbokjs-daemon';
// import watchServer from './server';
import * as configBuild from './config-build';

const startProxyPort: number = argv.browserSyncStartPort || 3000;
const startAppPort: number = argv.startAppPort || 3050;
const endProxyPort: number = startProxyPort + 49;
const endAppPort: number = startAppPort + 49;

execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);

let nodeChild: Daemon | undefined;

Promise.all([
  portscanner.findAPortNotInUse(startProxyPort, endProxyPort),
  portscanner.findAPortNotInUse(startAppPort, endAppPort),
  configBuild.build('./src/config', () => {
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
      autoRestart: true,
      args: [
        require.resolve(__filename.replace('/watch-', '/watch-node-')),
        '--port',
        port,
      ],
    });
    nodeChild.start();

    createChild({
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
    }).start();
  })
  .catch((err) => console.log(err.stack));
