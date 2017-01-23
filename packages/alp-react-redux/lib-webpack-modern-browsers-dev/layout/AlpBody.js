var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpBody.jsx',
    _this = this,
    _arguments = arguments;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Body } from 'fody';
import { ReactElementType, ReactNodeType } from '../types';

var PropsType = _t.interface({
  children: ReactNodeType
}, 'PropsType');

export default (function alpBody(_ref) {
  var { children } = _ref;

  var props = _objectWithoutProperties(_ref, ['children']);

  _assert({
    children,
    props
  }, PropsType, '{ children, ...props }');

  return _assert(function () {
    return React.createElement(
      Body,
      _extends({}, props, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }),
      React.createElement(
        'div',
        { id: 'loading-bar', className: 'loading-bar', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        React.createElement('div', { className: 'progress', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        })
      ),
      children
    );
  }.apply(_this, _arguments), ReactElementType, 'return value');
});

function _assert(x, type, name) {
  if (false) {
    _t.fail = function (message) {
      console.warn(message);
    };
  }

  if (_t.isType(type) && type.meta.kind !== 'struct') {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);
    }
  } else if (!(x instanceof type)) {
    _t.fail('Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')');
  }

  return x;
}
//# sourceMappingURL=AlpBody.js.map