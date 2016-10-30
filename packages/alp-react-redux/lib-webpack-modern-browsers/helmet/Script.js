var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';
import { Helmet } from 'fody';
import assetUrl from './assetUrl';

var Script = (_ref, _ref2) => {
  var src = _ref.src,
      props = _objectWithoutProperties(_ref, ['src']);

  var context = _ref2.context;

  var version = context.config.get('version');

  return React.createElement(Helmet, { script: [_extends({ rel: 'stylesheet', src: assetUrl(src, version) }, props)] });
};

Script.contextProps = {
  context: PropTypes.shape({ config: PropTypes.instanceOf(Map) }).isRequired
};

export default Script;
//# sourceMappingURL=Script.js.map