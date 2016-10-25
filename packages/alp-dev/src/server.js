// const bsReload = require('./bs-reload');
import argv from 'minimist-argv';
import { node as nodeDaemon } from 'springbokjs-daemon/src';
import { clean, watch } from './server-build';

clean();
watch().then((emitter) => {
  const daemon = nodeDaemon([
    '--harmony',
    '--es_staging',
    'lib-node6-dev/index.server.js',
    '--port',
    argv.proxyPort,
    '--version',
    `dev${Date.now()}`,
  ]);

  process.on('exit', () => {
    if (daemon) {
      daemon.stop();
    }
  });

  daemon.start();

  let _restartTimeout;
  emitter.on('changed', () => {
    if (_restartTimeout) clearTimeout(_restartTimeout);
    daemon.args[daemon.args.length - 1] = `dev${Date.now()}`;
    _restartTimeout = daemon.restartTimeout(1000);
  });
});
