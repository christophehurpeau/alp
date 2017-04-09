'use strict';

var _browser = require('../webpack/browser');

const browserCompiler = (0, _browser.createModernBrowserCompiler)(process.env.NODE_ENV === 'production');

browserCompiler.run();
//# sourceMappingURL=modern-browser.js.map