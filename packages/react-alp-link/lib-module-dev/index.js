var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';
import { TagNameOrReactComponentType as _TagNameOrReactComponentType } from 'alp-react-redux/types';

import t from 'flow-runtime';
var TagNameOrReactComponentType = t.tdz(function () {
  return _TagNameOrReactComponentType;
});
var PropsType = t.type('PropsType', t.object(t.property('as', t.nullable(t.ref(TagNameOrReactComponentType))), t.property('to', t.string()), t.property('params', t.nullable(t.object())), t.property('children', t.nullable(t.any()))));
var ContextType = t.type('ContextType', t.object(t.property('context', t.object(t.property('urlGenerator', t.function())))));


var LinkComponent = function LinkComponent(_arg, _arg2) {
  var _PropsType$assert = PropsType.assert(_arg),
      _PropsType$assert$as = _PropsType$assert.as,
      Type = _PropsType$assert$as === undefined ? 'a' : _PropsType$assert$as,
      _PropsType$assert$to = _PropsType$assert.to,
      to = _PropsType$assert$to === undefined ? 'default' : _PropsType$assert$to,
      params = _PropsType$assert.params,
      children = _PropsType$assert.children,
      props = _objectWithoutProperties(_PropsType$assert, ['as', 'to', 'params', 'children']);

  var _ContextType$assert = ContextType.assert(_arg2),
      ctx = _ContextType$assert.context;

  if (props.tagName) throw new Error('`tagName` is deprecated, use `as` instead');
  return React.createElement(
    Type,
    _extends({ href: ctx.urlGenerator(to, params) }, props, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 22
      }
    }),
    children
  );
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;
//# sourceMappingURL=index.js.map