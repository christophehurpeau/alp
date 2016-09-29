var _jsxFileName = 'index.jsx';
import React from 'react';
import _t from 'tcomb-forked';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';

TranslateComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired
};

var Props = _t.interface({
  id: _t.String
}, 'Props');

export default function TranslateComponent(_ref, _ref2) {
  var id = _ref.id;
  var children = _ref.children;

  var props = _objectWithoutProperties(_ref, ['id', 'children']);

  var context = _ref2.context;

  _assert({
    id,
    children,
    props
  }, Props, '{ id, children, props }');

  var translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return React.createElement(
    'span',
    {
      __self: this,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 26
      }
    },
    translated
  );
}

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