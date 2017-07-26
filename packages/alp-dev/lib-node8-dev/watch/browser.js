'use strict';

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _browser = require('../webpack/browser');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const browserCompiler = (0, _browser.createModernBrowserCompiler)();

(0, _browser.runDevServer)(browserCompiler, _minimistArgv2.default.port, _minimistArgv2.default['proxy-port']);
//# sourceMappingURL=browser.js.map