import './http/HttpServerRequest';
import './http/HttpServerResponse';
import Application from './application/Application';
import { createServer } from './application/server';

export function start(dirname) {
    dirname = dirname.replace(/\/+$/, '') + '/';

    const env = process.env.NODE_ENV || 'dev';

    if (!/^[a-z]+$/.test(env)) {
        throw new Error('Unacceptable env name: ' + env);
    }

    const app = new Application(dirname, env);

    createServer(app);

    return app;
}
