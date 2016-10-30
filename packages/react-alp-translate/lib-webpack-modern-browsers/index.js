import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';

var TranslateComponent = (_ref, _ref2) => {
  var id = _ref.id,
      children = _ref.children,
      props = _objectWithoutProperties(_ref, ['id', 'children']);

  var context = _ref2.context;

  var translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return React.createElement(
    'span',
    null,
    translated
  );
};

TranslateComponent.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.func
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired
};

export default TranslateComponent;
//# sourceMappingURL=index.js.map