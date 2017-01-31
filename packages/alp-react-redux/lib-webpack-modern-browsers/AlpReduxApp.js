import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { Provider } from 'react-redux';
import AlpReactApp from './AlpReactApp';


export default (function (_ref) {
  let { children, store } = _ref,
      props = _objectWithoutProperties(_ref, ['children', 'store']);

  return React.createElement(
    Provider,
    { store: store },
    React.createElement(
      AlpReactApp,
      props,
      children
    )
  );
});
//# sourceMappingURL=AlpReduxApp.js.map