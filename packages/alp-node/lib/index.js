'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _fs = require('fs');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

throw new Error('Use index.js');

let Application = class Application extends _koa2.default {
    init(fn) {
        return fn(this);
    }

    listen() {
        const socketPath = this.config.get('socketPath');
        const port = this.config.get('port');
        const hostname = this.config.get('hostname');

        this.logger.info('Creating server', socketPath ? { socketPath: socketPath } : { port: port }, { [socketPath ? 'socketPath' : 'port']: ['yellow'] });

        if (socketPath) {
            try {
                (0, _fs.unlinkSync)(socketPath);
            } catch (err) {}
        }

        this.listen(socketPath || port, hostname, function () {
            if (socketPath) {
                (0, _fs.chmodSync)(socketPath, '777');
            }

            this.logger.info('Server listening', socketPath ? { socketPath: socketPath } : { port: port }, { [socketPath ? 'socketPath' : 'port']: ['yellow'] });
        });
    }
};
exports.default = Application;
//# sourceMappingURL=index.js.map