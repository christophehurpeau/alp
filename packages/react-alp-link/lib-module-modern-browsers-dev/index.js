var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';
import { TagNameOrReactComponentType as _TagNameOrReactComponentType } from 'alp-react-redux/types';

import t from 'flow-runtime';
const TagNameOrReactComponentType = t.tdz(function () {
  return _TagNameOrReactComponentType;
});
const PropsType = t.type('PropsType', t.object(t.property('as', t.nullable(t.ref(TagNameOrReactComponentType))), t.property('to', t.string()), t.property('params', t.nullable(t.object())), t.property('children', t.nullable(t.any()))));
const ContextType = t.type('ContextType', t.object(t.property('context', t.object(t.property('urlGenerator', t.function())))));


const LinkComponent = function LinkComponent(_arg, _arg2) {
  let _PropsType$assert = PropsType.assert(_arg),
      { as: Type = 'a', to = 'default', params, children } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['as', 'to', 'params', 'children']);

  let { context: ctx } = ContextType.assert(_arg2);

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