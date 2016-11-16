'use strict';

var _springbokjsDaemon = require('springbokjs-daemon');

var _portscanner = require('portscanner');

var _portscanner2 = _interopRequireDefault(_portscanner);

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _server = require('./server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const startBrowserSyncPort = _minimistArgv2.default.browserSyncStartPort || 3000;
const startPort = _minimistArgv2.default.startPort || 3050;

Promise.all([new Promise((resolve, reject) => _portscanner2.default.findAPortNotInUse(startBrowserSyncPort, startBrowserSyncPort + 50, '127.0.0.1', (err, foundPort) => {
  if (err) return reject(err);
  resolve(foundPort);
})), new Promise((resolve, reject) => _portscanner2.default.findAPortNotInUse(startPort, startPort + 50, '127.0.0.1', (err, foundPort) => {
  if (err) return reject(err);
  resolve(foundPort);
}))]).then(([browserSyncPort, port]) => {
  (0, _springbokjsDaemon.node)([require.resolve('./browser-sync'), '--port', browserSyncPort, '--proxyPort', port]).start();

  return (0, _server2.default)(port);
}).catch(err => console.log(err.stack));
//# sourceMappingURL=watch.js.map