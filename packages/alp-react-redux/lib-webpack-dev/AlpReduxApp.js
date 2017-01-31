var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'AlpReduxApp.jsx',
    _this = this,
    _arguments = arguments;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Provider } from 'react-redux';
import AlpReactApp from './AlpReactApp';
import { ReactNodeType, ReactElementType } from './types';

var PropsType = _t.interface({
  children: ReactNodeType,
  store: _t.Object
}, 'PropsType');

export default (function alpReduxApp(_ref) {
  var children = _ref.children,
      store = _ref.store,
      props = _objectWithoutProperties(_ref, ['children', 'store']);

  _assert({
    children: children,
    store: store,
    props: props
  }, PropsType, '{ children, store, ...props }');

  return _assert(function () {
    return React.createElement(
      Provider,
      { store: store, __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 11
        }
      },
      React.createElement(
        AlpReactApp,
        _extends({}, props, {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 12
          }
        }),
        children
      )
    );
  }.apply(_this, _arguments), ReactElementType, 'return value');
});

function _assert(x, type, name) {
  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=AlpReduxApp.js.map