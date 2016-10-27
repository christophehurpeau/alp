'use strict';

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _springbokjsDaemon = require('springbokjs-daemon');

var _serverBuild = require('./server-build');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _serverBuild.clean)(); // const bsReload = require('./bs-reload');

(0, _serverBuild.watch)().then(emitter => {
  const daemon = (0, _springbokjsDaemon.node)(['lib-node6-dev/index.server.js', '--port', _minimistArgv2.default.proxyPort, '--version', `dev${ Date.now() }`]);

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
//# sourceMappingURL=server.js.map