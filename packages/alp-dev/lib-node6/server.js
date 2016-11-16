'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = watchServer;

var _springbokjsDaemon = require('springbokjs-daemon');

var _serverBuild = require('./server-build');

// const bsReload = require('./bs-reload');
function watchServer(port) {
  return (0, _serverBuild.watch)().then(emitter => {
    const daemon = (0, _springbokjsDaemon.node)(['lib-node6-dev/index.server.js', '--port', port, '--version', `dev${ Date.now() }`]);

    process.on('exit', () => {
      if (daemon) {
        daemon.stop();
      }
    });

    daemon.start();

    let _restartTimeout;
    emitter.on('changed', () => {
      if (_restartTimeout) clearTimeout(_restartTimeout);
      daemon.args[daemon.args.length - 1] = `dev${ Date.now() }`;
      _restartTimeout = daemon.restartTimeout(1000);
    });
  });
}
//# sourceMappingURL=server.js.map