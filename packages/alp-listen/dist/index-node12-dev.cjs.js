'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const fs = require('fs');
const http = require('http');
const https = require('https');
const Logger = require('nightingale-logger');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const Logger__default = /*#__PURE__*/_interopDefaultLegacy(Logger);

const logger = new Logger__default('alp:listen');

const createServer = (callback, socketPath, tls, dirname = '') => {
  const createServer = !socketPath && tls ? https.createServer : http.createServer;

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
      } catch {}

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
//# sourceMappingURL=index-node12-dev.cjs.js.map
