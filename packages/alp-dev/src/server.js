// const bsReload = require('./bs-reload');
import { node as nodeDaemon } from 'springbokjs-daemon/src';
import { watch } from './config-build';

export default function watchServer(port) {
  return watch().then(emitter => {
    const daemon = nodeDaemon([
      'lib-node6-dev/index.server.js',
      '--port',
      port,
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
}
