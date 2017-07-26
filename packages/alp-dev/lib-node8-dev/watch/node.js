'use strict';

var _minimistArgv = require('minimist-argv');

var _minimistArgv2 = _interopRequireDefault(_minimistArgv);

var _node = require('../webpack/node');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const nodeCompiler = (0, _node.createNodeCompiler)();

(0, _node.watchAndRun)(nodeCompiler, _minimistArgv2.default.port);
//# sourceMappingURL=node.js.map