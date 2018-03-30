/* eslint-disable global-require */
import { execSync } from 'child_process';
import path from 'path';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import createChild from 'springbokjs-daemon/src';
// import watchServer from './server';
import * as configBuild from './config-build';

const startProxyPort = argv.browserSyncStartPort || 3000;
const startAppPort = argv.startAppPort || 3050;

execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);

Promise.all([
  portscanner.findAPortNotInUse(startProxyPort, startProxyPort + 49),
  portscanner.findAPortNotInUse(startAppPort, startAppPort + 49),
  configBuild.build(),
])
  .then(([proxyPort, port]) => {
    if (proxyPort === port) {
      throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
    }

    createChild({
      autoRestart: true,
      args: [require.resolve(__filename.replace('/watch-', '/watch-node-')), '--port', port],
    }).start();

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
  .catch(err => console.log(err.stack));
