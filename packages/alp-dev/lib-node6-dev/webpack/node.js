'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.watchAndRun = exports.createNodeCompiler = undefined;

var _pobpackNode = require('pobpack-node');

var _createPobpackConfig = require('./createPobpackConfig');

var _createPobpackConfig2 = _interopRequireDefault(_createPobpackConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createNodeCompiler = exports.createNodeCompiler = production => (0, _pobpackNode.createAppNodeCompiler)((0, _createPobpackConfig2.default)('node', production));

const watchAndRun = exports.watchAndRun = (nodeCompiler, port) => (0, _pobpackNode.watchAndRunCompiler)(nodeCompiler, {
  key: 'alp-dev:watch',
  args: ['--port', port],
  cwd: nodeCompiler.webpackConfig.output.path
});
//# sourceMappingURL=node.js.map