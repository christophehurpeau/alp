var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'index.jsx',
    _this = this;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/* eslint-disable react/forbid-prop-types */
import { PropTypes } from 'react';

var PropsType = _t.interface({
  to: _t.String,
  params: _t.maybe(_t.Object)
}, 'PropsType');

var ContextType = _t.interface({
  context: _t.interface({
    urlGenerator: _t.Function
  })
}, 'ContextType');

var LinkComponent = function LinkComponent(_ref, _ref2) {
  var _ref$to = _ref.to,
      to = _ref$to === undefined ? 'default' : _ref$to,
      params = _ref.params,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['to', 'params', 'children']);

  var ctx = _ref2.context;

  _assert({
    to: to,
    params: params,
    children: children,
    props: props
  }, PropsType, '{ to = \'default\', params, children, ...props }');

  _assert({
    context: ctx
  }, ContextType, '{ context: ctx }');

  return React.createElement(
    'a',
    _extends({ href: ctx.urlGenerator(to, params) }, props, {
      __self: _this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 19
      }
    }),
    children
  );
};

LinkComponent.propTypes = {
  to: PropTypes.string.isRequired,
  params: PropTypes.object,
  children: PropTypes.node
};

LinkComponent.contextTypes = {
  context: PropTypes.shape({
    urlGenerator: PropTypes.func
  })
};

export default LinkComponent;

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
//# sourceMappingURL=index.js.map