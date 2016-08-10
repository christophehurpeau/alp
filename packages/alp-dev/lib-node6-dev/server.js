'use strict';

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _springbokjsDaemon = require('springbokjs-daemon');

var _pobBuild = require('./pob-build');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pobBuild.clean)(); // const bsReload = require('./bs-reload');

(0, _pobBuild.watch)().then(emitter => {
    start();
    emitter.on('changed', () => {
        return restart();
    });
});

let daemon;
process.on('exit', code => {
    if (daemon) {
        daemon.stop();
    }
});

function start() {
    daemon = daemon || (0, _springbokjsDaemon.node)(['--harmony', '--es_staging', 'lib-node6/index.server.js', '--port', _minimistArgv2.default.proxyPort, '--version', `dev${ Date.now() }`]);
    daemon.start();
}

let _restartTimeout;

function restart() {
    if (!daemon) return start();

    if (_restartTimeout) clearTimeout(_restartTimeout);
    _restartTimeout = setTimeout(() => {
        daemon.args[daemon.args.length - 1] = `dev${ Date.now() }`;
        daemon.restart();
    }, 1000);
}
//# sourceMappingURL=server.js.map