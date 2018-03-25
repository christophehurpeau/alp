import { chmodSync, unlinkSync, readFileSync } from 'fs';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:listen');

/**
 * @param {string} dirname for tls server, dirname of the server.key and server.crt
 * @returns {Function}
 */
function alpListen(dirname) {
  return app => new Promise(resolve => {
    const socketPath = app.config.get('socketPath');
    const port = app.config.get('port');
    const hostname = app.config.get('hostname');
    const tls = app.config.get('tls');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const createServer = require(!socketPath && tls ? 'https' : 'http').createServer;

    logger.info('Creating server', socketPath ? { socketPath } : { port }, {
      [socketPath ? 'socketPath' : 'port']: ['yellow']
    });

    const server = (() => {
      if (!tls) {
        return createServer(app.callback());
      }

      const options = {
        key: readFileSync(`${dirname}/server.key`),
        cert: readFileSync(`${dirname}/server.crt`)
      };

      return createServer(options, app.callback());
    })();

    if (socketPath) {
      try {
        unlinkSync(socketPath);
      } catch (err) {}

      server.listen(socketPath, () => {
        if (socketPath) {
          chmodSync(socketPath, '777');
        }

        logger.info('Server listening', { socketPath }, { socketPath: ['yellow'] });
        resolve(server);
      });
    } else {
      server.listen(port, hostname, () => {
        logger.info('Server listening', { port }, { port: ['yellow'] });
        resolve(server);
      });
    }
  });
}

export default alpListen;
//# sourceMappingURL=index-node8-dev.es.js.map
