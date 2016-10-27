'use strict';

var _springbokjsDaemon = require('springbokjs-daemon');

require('./server');

(0, _springbokjsDaemon.node)([require.resolve('./browser-sync'), ...process.argv.slice(2)]).start();
//# sourceMappingURL=watch.js.map