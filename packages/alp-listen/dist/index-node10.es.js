import { unlinkSync, chmodSync, readFileSync } from 'fs';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:listen');

const createServer = (callback, socketPath, tls, dirname) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const createServer = require(!socketPath && tls ? 'https' : 'http').createServer;

  if (!tls) {
    return createServer(callback);
  }

  const options = {
    key: readFileSync(`${dirname}/server.key`),
    cert: readFileSync(`${dirname}/server.crt`)
  };
  return createServer(options, callback);
};

function alpListen(config, callback, dirname) {
  return new Promise(resolve => {
    const socketPath = config.get('socketPath');
    const port = config.get('port');
    const hostname = config.get('hostname');
    const tls = config.get('tls');
    logger.info('Creating server', socketPath ? {
      socketPath
    } : {
      port
    });
    const server = createServer(callback, socketPath, tls, dirname);

    if (socketPath) {
      try {
        unlinkSync(socketPath);
      } catch (err) {}

      server.listen(socketPath, () => {
        if (socketPath) {
          chmodSync(socketPath, '777');
        }

        logger.info('Server listening', {
          socketPath
        });
        resolve(server);
      });
    } else {
      server.listen(port, hostname, () => {
        logger.info('Server listening', {
          port
        });
        resolve(server);
      });
    }
  });
}

export default alpListen;
//# sourceMappingURL=index-node10.es.js.map
