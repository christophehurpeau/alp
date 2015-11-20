'use strict';

var _interopRequireWildcard = require('babel-runtime/helpers/interop-require-wildcard').default;

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.default = prepareApplication;

var _aukReact = require('auk-react');

var reactComponent = _interopRequireWildcard(_aukReact);

/** @function 
* @param app */
function prepareApplication(app) {
    app.loadComponent(reactComponent);
}

module.exports = exports.default;
//# sourceMappingURL=prepareApplication.js.map
