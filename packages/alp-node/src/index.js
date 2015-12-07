throw new Error('Use index.js');

import { chmodSync, unlinkSync } from 'fs';
import Koa from 'koa';

export default class Application extends Koa {
    init(fn) {
        return fn(this);
    }

    listen() {
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

        this.listen(socketPath || port, hostname, function() {
            if (socketPath) {
                chmodSync(socketPath, '777');
            }

            this.logger.info(
                'Server listening',
                socketPath ? { socketPath: socketPath } : { port: port },
                { [socketPath ? 'socketPath' : 'port']: ['yellow'] }
            );
        });
    }
}
