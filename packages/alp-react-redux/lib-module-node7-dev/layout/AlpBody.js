var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/AlpBody.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Body } from 'fody';
import { ReactElementType as _ReactElementType, ReactNodeType as _ReactNodeType } from '../types';

import t from 'flow-runtime';
const ReactElementType = t.tdz(() => _ReactElementType);
const ReactNodeType = t.tdz(() => _ReactNodeType);
const PropsType = t.type('PropsType', t.object(t.property('children', t.ref(ReactNodeType))));


export default (function alpBody(_arg) {
  const _returnType = t.return(t.ref(ReactElementType));

  let _PropsType$assert = PropsType.assert(_arg),
      { children } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['children']);

  return _returnType.assert(React.createElement(
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
  ));
});
//# sourceMappingURL=AlpBody.js.map