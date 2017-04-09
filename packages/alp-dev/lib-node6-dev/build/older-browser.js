'use strict';

var _browser = require('../webpack/browser');

const browserCompiler = (0, _browser.createOlderBrowserCompiler)(process.env.NODE_ENV === 'production');

browserCompiler.clean();
browserCompiler.run();
//# sourceMappingURL=older-browser.js.map