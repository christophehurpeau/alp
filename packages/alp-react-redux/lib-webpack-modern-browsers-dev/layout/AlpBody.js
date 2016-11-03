var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpBody.jsx',
    _this = this;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Body } from 'fody';
import { ReactElementType, ReactNodeType } from '../types';

var PropsType = _t.interface({
  children: ReactNodeType
}, 'PropsType');

export default ((_ref) => {
  var children = _ref.children,
      props = _objectWithoutProperties(_ref, ['children']);

  _assert({
    children,
    props
  }, PropsType, '{ children, ...props }');

  return _assert((() => {
    return React.createElement(
      Body,
      _extends({}, props, {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      }),
      React.createElement(
        'div',
        { id: 'loading-bar', className: 'loading-bar', __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        },
        React.createElement('div', { className: 'progress', __self: _this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        })
      ),
      children
    );
  })(), ReactElementType, 'return value');
});

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=AlpBody.js.map