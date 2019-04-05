'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const fs = require('fs');
const Logger = _interopDefault(require('nightingale-logger'));

const logger = new Logger('alp:listen');

const createServer = (callback, socketPath, tls, dirname) => {
  // eslint-disable-next-line global-require, import/no-dynamic-require
  const createServer = require(!socketPath && tls ? 'https' : 'http').createServer;

  if (!tls) {
    return createServer(callback);
  }

  const options = {
    key: fs.readFileSync(`${dirname}/server.key`),
    cert: fs.readFileSync(`${dirname}/server.crt`)
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
        fs.unlinkSync(socketPath);
      } catch (err) {}

      server.listen(socketPath, () => {
        if (socketPath) {
          fs.chmodSync(socketPath, '777');
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

exports.default = alpListen;
//# sourceMappingURL=index-node10-dev.cjs.js.map
