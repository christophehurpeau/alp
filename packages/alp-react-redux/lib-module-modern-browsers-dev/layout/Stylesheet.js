var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/Stylesheet.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import assetUrl from './assetUrl';

import t from 'flow-runtime';
const PropsType = t.type('PropsType', t.object(t.property('href', t.string())));
const ContextType = t.type('ContextType', t.object(t.property('context', t.object(t.property('config', t.ref('Map', t.string(), t.any()))))));


export default (function stylesheet(_arg, _arg2) {
  let _PropsType$assert = PropsType.assert(_arg),
      { href } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['href']);

  let { context } = ContextType.assert(_arg2);

  const version = t.string().assert(context.config.get('version'));

  return React.createElement('link', _extends({ rel: 'stylesheet', href: assetUrl(href, version) }, props, {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }));
});
//# sourceMappingURL=Stylesheet.js.map