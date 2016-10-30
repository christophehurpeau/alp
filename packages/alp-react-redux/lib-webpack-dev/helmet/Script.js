var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'helmet/Script.jsx',
    _this = this;

import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';
import { Helmet } from 'fody';
import assetUrl from './assetUrl';

var PropsType = _t.interface({
  src: _t.String
}, 'PropsType');

var Script = function Script(_ref, _ref2) {
  var src = _ref.src,
      props = _objectWithoutProperties(_ref, ['src']);

  var context = _ref2.context;

  _assert({
    src: src,
    props: props
  }, PropsType, '{ src, ...props }');

  var version = context.config.get('version');

  return React.createElement(Helmet, { script: [_extends({ rel: 'stylesheet', src: assetUrl(src, version) }, props)], __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 12
    }
  });
};

Script.contextProps = {
  context: PropTypes.shape({ config: PropTypes.instanceOf(Map) }).isRequired
};

export default Script;

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
//# sourceMappingURL=Script.js.map