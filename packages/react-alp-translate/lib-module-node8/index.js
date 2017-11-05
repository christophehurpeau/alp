function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import PropTypes from 'prop-types';

const TranslateComponent = (_ref, { context }) => {
  let { id, children } = _ref,
      props = _objectWithoutProperties(_ref, ['id', 'children']);

  const translated = context.t(id, props);

  if (children) {
    return children(translated);
  }

  return translated;
};

TranslateComponent.contextTypes = {
  context: PropTypes.object.isRequired
};

export default TranslateComponent;
//# sourceMappingURL=index.js.map