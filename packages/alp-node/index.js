'use strict';
const fs = require('fs');
const chmodSync = fs.chmodSync;
const unlinkSync = fs.unlinkSync;
const Koa = require('koa');

class Application extends Koa {
    get environment() {
        return this.env;
    }

    init(fn) {
        return fn(this);
    }

    listen() {
        return new Promise((resolve) => {
            const socketPath = this.config.get('socketPath');
            const port = this.config.get('port');
            const hostname = this.config.get('hostname');

            this.logger.info(
                'Creating server',
                socketPath ? { socketPath: socketPath } : { port: port },
                { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
            );

            if (socketPath) {
                try {
                    unlinkSync(socketPath);
                } catch (err) {
                }
            }

            const server = super.listen(socketPath || port, hostname, () => {
                if (socketPath) {
                    chmodSync(socketPath, '777');
                }

                this.logger.info(
                    'Server listening',
                    socketPath ? { socketPath: socketPath } : { port: port },
                    { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
                );

                resolve(server);
            });
        });
    }
}

module.exports = Application;
module.exports.default = Application;
