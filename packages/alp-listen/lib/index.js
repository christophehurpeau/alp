'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpListen;

var _fs = require('fs');

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp.listen');

/**
 * @param {string} dirname for tls server, dirname of the server.key and server.crt
 * @returns {Function}
 */
/**
 * @function
 * @param dirname
*/function alpListen(dirname) {
    /**
     * @returns {Promise}
     */
    return app => {
        return new Promise(resolve => {
            const socketPath = app.config.get('socketPath');
            const port = app.config.get('port');
            const hostname = app.config.get('hostname');
            const tls = app.config.get('tls');
            const createServer = require(!socketPath && tls ? 'https' : 'http').createServer;

            logger.info('Creating server', socketPath ? { socketPath: socketPath } : { port: port }, { [socketPath ? 'socketPath' : 'port']: ['yellow'] });

            const server = (() => {
                if (!tls) {
                    return createServer(app.callback());
                }

                const options = {
                    key: (0, _fs.readFileSync)(`${ dirname }/server.key`),
                    cert: (0, _fs.readFileSync)(`${ dirname }/server.crt`)
                };

                return createServer(options, app.callback());
            })();

            if (socketPath) {
                try {
                    (0, _fs.unlinkSync)(socketPath);
                } catch (err) {}

                server.listen(socketPath, () => {
                    if (socketPath) {
                        (0, _fs.chmodSync)(socketPath, '777');
                    }

                    logger.info('Server listening', { socketPath: socketPath }, { socketPath: ['yellow'] });
                    resolve(server);
                });
            } else {
                server.listen(port, hostname, () => {
                    logger.info('Server listening', { port: port }, { port: ['yellow'] });
                    resolve(server);
                });
            }
        });
    };
}
//# sourceMappingURL=index.js.map