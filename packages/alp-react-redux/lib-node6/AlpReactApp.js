'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _fody = require('fody');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = (_ref) => {
  let children = _ref.children,
      context = _ref.context,
      moduleDescriptor = _ref.moduleDescriptor,
      scriptName = _ref.scriptName,
      initialData = _ref.initialData,
      initialBrowserContext = _ref.initialBrowserContext;

  const version = context.config.get('version');
  const moduleIdentifier = moduleDescriptor && moduleDescriptor.identifier;
  if (!version) throw new Error('Invalid version');

  return _react2.default.createElement(
    _fody.App,
    { context: context },
    _react2.default.createElement(
      'div',
      { className: 'react-app' },
      null,
      children
    )
  );
}; /* eslint-disable prefer-template */
//# sourceMappingURL=AlpReactApp.js.map