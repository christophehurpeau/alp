'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = aukLogger;

var _nightingale = require('nightingale');

function aukLogger(app) {
    var logConfig = app.config.get('log');
    app.logger = new _nightingale.ConsoleLogger('app', logConfig && logConfig.level || _nightingale.LogLevel.ALL);
}
//# sourceMappingURL=index.js.map