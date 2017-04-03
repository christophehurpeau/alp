var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpLayout.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { LayoutPropsType as _LayoutPropsType, ReactElementType as _ReactElementType } from 'fody/types';
import { Html } from 'fody';
import AlpHead from './AlpHead';
import AlpBody from './AlpBody';

import t from 'flow-runtime';
var LayoutPropsType = t.tdz(function () {
  return _LayoutPropsType;
});
var ReactElementType = t.tdz(function () {
  return _ReactElementType;
});
export default (function alpLayout(_arg) {
  var _returnType = t.return(t.ref(ReactElementType));

  var _t$ref$assert = t.ref(LayoutPropsType).assert(_arg),
      helmet = _t$ref$assert.helmet,
      content = _t$ref$assert.content,
      props = _objectWithoutProperties(_t$ref$assert, ['helmet', 'content']);

  return _returnType.assert(React.createElement(
    Html,
    { helmet: helmet, __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 7
      }
    },
    React.createElement(AlpHead, _extends({ helmet: helmet }, props, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 8
      }
    })),
    React.createElement(
      AlpBody,
      {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 9
        }
      },
      React.createElement('div', { id: 'app', dangerouslySetInnerHTML: { __html: content }, __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 10
        }
      })
    )
  ));
});
//# sourceMappingURL=AlpLayout.js.map