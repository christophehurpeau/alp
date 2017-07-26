'use strict';

var _node = require('../webpack/node');

const nodeCompiler = (0, _node.createNodeCompiler)(process.env.NODE_ENV === 'production');

nodeCompiler.run();
//# sourceMappingURL=node.js.map