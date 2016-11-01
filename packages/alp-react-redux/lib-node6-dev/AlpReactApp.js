'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _jsxFileName = 'AlpReactApp.jsx'; /* eslint-disable prefer-template */

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _fody = require('fody');

var _types = require('./types');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PropsType = _tcombForked2.default.interface({
  children: _types.ReactNodeType,
  context: _tcombForked2.default.Object,
  moduleDescriptor: _types.ModuleDescriptorType,
  scriptName: _tcombForked2.default.maybe(_tcombForked2.default.String),
  initialData: _tcombForked2.default.maybe(_tcombForked2.default.Object)
}, 'PropsType');

exports.default = (_ref) => {
  var _assert2 = _assert(_ref, PropsType, '{ children, context, moduleDescriptor, scriptName, initialData, initialBrowserContext }');

  let children = _assert2.children,
      context = _assert2.context,
      moduleDescriptor = _assert2.moduleDescriptor,
      scriptName = _assert2.scriptName,
      initialData = _assert2.initialData,
      initialBrowserContext = _assert2.initialBrowserContext;

  _assert({
    children,
    context,
    moduleDescriptor,
    scriptName,
    initialData,
    initialBrowserContext
  }, PropsType, '{ children, context, moduleDescriptor, scriptName, initialData, initialBrowserContext }');

  return _assert((() => {
    const version = _assert(context.config.get('version'), _tcombForked2.default.String, 'version');
    const moduleIdentifier = _assert(moduleDescriptor && moduleDescriptor.identifier, _tcombForked2.default.maybe(_tcombForked2.default.String), 'moduleIdentifier');
    if (!version) throw new Error('Invalid version');

    return _react2.default.createElement(
      _fody.App,
      { context: context, __self: undefined,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 28
        }
      },
      _react2.default.createElement(
        'div',
        { className: 'react-app', __self: undefined,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 29
          }
        },
        null,
        children
      )
    );
  })(), _types.ReactNodeType, 'return value');
};

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=AlpReactApp.js.map