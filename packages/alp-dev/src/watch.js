import { node as nodeDaemon } from 'springbokjs-daemon/src';
import portscanner from 'portscanner';
import argv from 'minimist-argv';
import watchServer from './server';

const startBrowserSyncPort = argv.browserSyncStartPort || 3000;
const startPort = argv.startPort || 3050;

Promise.all([
  new Promise((resolve, reject) => (
    portscanner.findAPortNotInUse(startBrowserSyncPort, startBrowserSyncPort + 50, '127.0.0.1', (err, foundPort) => {
      if (err) return reject(err);
      resolve(foundPort);
    })
  )),
  new Promise((resolve, reject) => (
    portscanner.findAPortNotInUse(startPort, startPort + 50, '127.0.0.1', (err, foundPort) => {
      if (err) return reject(err);
      resolve(foundPort);
    })
  )),
]).then(([browserSyncPort, port]) => {
  nodeDaemon([
    require.resolve('./browser-sync'),
    '--port',
    browserSyncPort,
    '--proxyPort',
    port,
  ]).start();

  return watchServer(port);
}).catch(err => console.log(err.stack));
