'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = aukLogger;

var _nightingale = require('nightingale');

/** @function 
* @param app */
function aukLogger(app) {
    const logConfig = app.config.get('log');
    app.logger = new _nightingale.ConsoleLogger('app', logConfig && logConfig.level || _nightingale.LogLevel.ALL);
}

module.exports = exports.default;
//# sourceMappingURL=index.js.map