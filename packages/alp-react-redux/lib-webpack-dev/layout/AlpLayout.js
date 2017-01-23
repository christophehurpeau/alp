var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpLayout.jsx',
    _this = this,
    _arguments = arguments;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { LayoutPropsType, ReactElementType } from 'fody/types';
import { Html } from 'fody';
import AlpHead from './AlpHead';
import AlpBody from './AlpBody';

export default (function alpLayout(_ref) {
  var helmet = _ref.helmet,
      content = _ref.content,
      props = _objectWithoutProperties(_ref, ['helmet', 'content']);

  _assert({
    helmet: helmet,
    content: content,
    props: props
  }, LayoutPropsType, '{ helmet, content, ...props }');

  return _assert(function () {
    return React.createElement(
      Html,
      { helmet: helmet, __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 7
        }
      },
      React.createElement(AlpHead, _extends({ helmet: helmet }, props, {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 8
        }
      })),
      React.createElement(
        AlpBody,
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 9
          }
        },
        React.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content }, __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 10
          }
        })
      )
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
//# sourceMappingURL=AlpLayout.js.map