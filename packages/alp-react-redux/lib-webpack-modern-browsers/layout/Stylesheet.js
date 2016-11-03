var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import assetUrl from './assetUrl';

export default ((_ref, _ref2) => {
  var href = _ref.href,
      props = _objectWithoutProperties(_ref, ['href']);

  var context = _ref2.context;

  var version = context.config.get('version');

  return React.createElement('link', _extends({ rel: 'stylesheet', href: assetUrl(href, version) }, props));
});
//# sourceMappingURL=Stylesheet.js.map