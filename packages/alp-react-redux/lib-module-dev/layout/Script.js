var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'layout/Script.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import assetUrl from './assetUrl';

import t from 'flow-runtime';
var PropsType = t.type('PropsType', t.object(t.property('src', t.string())));
var ContextType = t.type('ContextType', t.object(t.property('context', t.object(t.property('config', t.ref('Map', t.string(), t.any()))))));


export default (function script(_ref, _ref2) {
  var context = _ref2.context;

  var src = _ref.src,
      props = _objectWithoutProperties(_ref, ['src']);

  t.param('arguments[0]', PropsType).assert(arguments[0]);
  t.param('arguments[1]', ContextType).assert(arguments[1]);

  var version = t.string().assert(context.config.get('version'));

  return React.createElement('script', _extends({ src: assetUrl(src, version) }, props, {
    __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 16
    }
  }));
});
//# sourceMappingURL=Script.js.map