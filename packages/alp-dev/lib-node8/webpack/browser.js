'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.runDevServer = exports.createOlderBrowserCompiler = exports.createModernBrowserCompiler = undefined;

var _pobpackBrowser = require('pobpack-browser');

var _createPobpackConfig = require('./createPobpackConfig');

var _createPobpackConfig2 = _interopRequireDefault(_createPobpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createModernBrowserCompiler = exports.createModernBrowserCompiler = production => (0, _pobpackBrowser.createAppBrowserCompiler)(_pobpackBrowser.MODERN, (0, _createPobpackConfig2.default)('modern-browser', production));

const createOlderBrowserCompiler = exports.createOlderBrowserCompiler = production => (0, _pobpackBrowser.createAppBrowserCompiler)(_pobpackBrowser.ALL, (0, _createPobpackConfig2.default)('browser', production));

const runDevServer = exports.runDevServer = (compiler, port, proxyPort) => (0, _pobpackBrowser.runDevServer)(compiler, {
  port: proxyPort,
  https: false,

  // contentBase: false,

  headers: {
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap'
  },

  proxy: {
    '**': `http://localhost:${port}`
  }
});
//# sourceMappingURL=browser.js.map