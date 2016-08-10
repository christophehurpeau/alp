// const bsReload = require('./bs-reload');
import argv from 'minimist-argv';
import { node as nodeDaemon } from 'springbokjs-daemon';
import { clean, watch } from './pob-build';

clean();
watch().then(emitter => {
    start();
    emitter.on('changed', () => restart());
});


let daemon;
process.on('exit', code => {
    if (daemon) {
        daemon.stop();
    }
});

function start() {
    daemon = daemon || nodeDaemon([
        '--harmony',
        '--es_staging',
        'lib-node6/index.server.js',
        '--port',
        argv.proxyPort,
        '--version',
        `dev${Date.now()}`,
    ]);
    daemon.start();
}

let _restartTimeout;

function restart() {
    if (!daemon) return start();

    if (_restartTimeout) clearTimeout(_restartTimeout);
    _restartTimeout = setTimeout(() => {
        daemon.args[daemon.args.length - 1] = `dev${Date.now()}`;
        daemon.restart();
    }, 1000);
}
