'use strict';

var _child_process = require('child_process');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _portscanner = require('portscanner');

var _portscanner2 = _interopRequireDefault(_portscanner);

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _springbokjsDaemon = require('springbokjs-daemon');

var _springbokjsDaemon2 = _interopRequireDefault(_springbokjsDaemon);

var _configBuild = require('../config-build');

var configBuild = _interopRequireWildcard(_configBuild);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable global-require */
const startProxyPort = _minimistArgv2.default.browserSyncStartPort || 3000;
// import watchServer from './server';

const startAppPort = _minimistArgv2.default.startAppPort || 3050;

(0, _child_process.execSync)(`rm -Rf ${_path2.default.resolve('public')}/* ${_path2.default.resolve('build')}/*`);

Promise.all([_portscanner2.default.findAPortNotInUse(startProxyPort, startProxyPort + 49), _portscanner2.default.findAPortNotInUse(startAppPort, startAppPort + 49), configBuild.build()]).then(([proxyPort, port]) => {
  if (proxyPort === port) {
    throw new Error(`"proxyPort" and "port" cannot have the same value: ${port}`);
  }

  (0, _springbokjsDaemon2.default)({
    autoRestart: true,
    args: [`${__dirname}/watch/node`, '--port', port]
  }).start();

  (0, _springbokjsDaemon2.default)({
    autoRestart: true,
    args: [`${__dirname}/watch/browser`, '--port', port, '--proxy-port', proxyPort]
  }).start();
}).catch(err => console.log(err.stack));
//# sourceMappingURL=index.js.map