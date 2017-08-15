import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';

import _t from 'flow-runtime';

var ChildrenCallbackType = _t.type('ChildrenCallbackType', _t.function(_t.param('translated', _t.string()), _t.return(_t.void())));

var PropsType = _t.type('PropsType', _t.exactObject(_t.property('id', _t.string()), _t.property('as', _t.nullable(_t.string())), _t.property('children', _t.nullable(ChildrenCallbackType)), _t.indexer('key', _t.string(), _t.any())));

var TranslateComponent = function TranslateComponent(_arg, _arg2) {
  var _PropsType$assert = PropsType.assert(_arg),
      id = _PropsType$assert.id,
      _PropsType$assert$as = _PropsType$assert.as,
      AsType = _PropsType$assert$as === undefined ? 'span' : _PropsType$assert$as,
      children = _PropsType$assert.children,
      props = _objectWithoutProperties(_PropsType$assert, ['id', 'as', 'children']);

  var context = _arg2.context;

  var translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return React.createElement(
    AsType,
    null,
    translated
  );
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired
};

export default TranslateComponent;
//# sourceMappingURL=index.js.map