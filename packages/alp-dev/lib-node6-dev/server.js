'use strict';

var _pobBabel = require('pob-babel');

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _springbokjsDaemon = require('springbokjs-daemon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _pobBabel.registerPlugin)(require('./pob-build-plugins/yml')); // const bsReload = require('./bs-reload');


(0, _pobBabel.clean)();
(0, _pobBabel.watch)().then(emitter => {
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