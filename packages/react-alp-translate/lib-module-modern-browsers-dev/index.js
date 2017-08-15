import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';

import _t from 'flow-runtime';

const ChildrenCallbackType = _t.type('ChildrenCallbackType', _t.function(_t.param('translated', _t.string()), _t.return(_t.void())));

const PropsType = _t.type('PropsType', _t.exactObject(_t.property('id', _t.string()), _t.property('as', _t.nullable(_t.string())), _t.property('children', _t.nullable(ChildrenCallbackType)), _t.indexer('key', _t.string(), _t.any())));

const TranslateComponent = function TranslateComponent(_arg, _arg2) {
  let _PropsType$assert = PropsType.assert(_arg),
      { id, as: AsType = 'span', children } = _PropsType$assert,
      props = _objectWithoutProperties(_PropsType$assert, ['id', 'as', 'children']);

  let { context } = _arg2;

  const translated = context.t(id, props);

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