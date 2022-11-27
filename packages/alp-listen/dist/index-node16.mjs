import { unlinkSync, chmodSync, readFileSync } from 'fs';
import { createServer as createServer$2 } from 'http';
import { createServer as createServer$1 } from 'https';
import { Logger } from 'nightingale-logger';

const logger = new Logger('alp:listen');
const createServer = (callback, socketPath, tls, dirname = '') => {
  const createHttpServer = !socketPath && tls ? createServer$1 : createServer$2;
  if (!tls) {
    return createHttpServer(callback);
  }
  const options = {
    key: readFileSync(`${dirname}/server.key`),
    cert: readFileSync(`${dirname}/server.crt`)
  };
  return createHttpServer(options, callback);
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
      } catch {}
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

export { alpListen as default };
//# sourceMappingURL=index-node16.mjs.map
