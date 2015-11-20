'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = prepareApplication;

var _aukTuraco = require('auk-turaco');

var turacoComponent = _interopRequireWildcard(_aukTuraco);

/** @function 
* @param app */
function prepareApplication(app) {
    app.loadComponent(turacoComponent);
}

module.exports = exports.default;
//# sourceMappingURL=prepareApplication.js.map
