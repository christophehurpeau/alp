var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'AlpReduxApp.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Provider } from 'react-redux';
import AlpReactApp from './AlpReactApp';
import { ReactNodeType as _ReactNodeType, ReactElementType as _ReactElementType } from './types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactElementType = t.tdz(() => _ReactElementType);
const PropsType = t.type('PropsType', t.object(t.property('children', t.ref(ReactNodeType)), t.property('store', t.object())));


export default (function alpReduxApp(_ref) {
  let { children, store } = _ref,
      props = _objectWithoutProperties(_ref, ['children', 'store']);

  const _returnType = t.return(t.ref(ReactElementType));

  t.param('arguments[0]', PropsType).assert(arguments[0]);
  return _returnType.assert(React.createElement(
    Provider,
    { store: store, __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 11
      }
    },
    React.createElement(
      AlpReactApp,
      _extends({}, props, {
        __self: _this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 12
        }
      }),
      children
    )
  ));
});
//# sourceMappingURL=AlpReduxApp.js.map