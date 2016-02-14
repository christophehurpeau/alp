'use strict';
const fs = require('fs');
const chmodSync = fs.chmodSync;
const unlinkSync = fs.unlinkSync;
const readFileSync = fs.readFileSync;
const Koa = require('koa');

class Application extends Koa {
    get environment() {
        return this.env;
    }

    init(fn) {
        return fn(this);
    }

    /**
     * @param [dirname] for tls server, dirname of the server.key and server.crt
     * @returns {Promise}
     */
    listen(dirname) {
        return new Promise((resolve) => {
            const socketPath = this.config.get('socketPath');
            const port = this.config.get('port');
            const hostname = this.config.get('hostname');
            const tls = this.config.get('tls');
            const createServer = require(!socketPath && tls ? 'https' : 'http').createServer;

            this.logger.info(
                'Creating server',
                socketPath ? { socketPath: socketPath } : { port: port },
                { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
            );

            const server = (() => {
                if (!tls) {
                    return createServer(this.callback());
                }

                const options = {
                    key: readFileSync(`${dirname}/server.key`),
                    cert: readFileSync(`${dirname}/server.crt`),
                };

                return createServer(options, this.callback());
            })();

            if (socketPath) {
                try {
                    unlinkSync(socketPath);
                } catch (err) {
                }

                server.listen(socketPath, () => {
                    if (socketPath) {
                        chmodSync(socketPath, '777');
                    }

                    this.logger.info('Server listening', { socketPath }, { socketPath: ['yellow'] });
                    resolve(server);
                });
            } else {
                server.listen(port, hostname, () => {
                    this.logger.info('Server listening', { port }, { port: ['yellow'] });
                    resolve(server);
                });
            }
        });
    }
}

module.exports = Application;
module.exports.default = Application;
