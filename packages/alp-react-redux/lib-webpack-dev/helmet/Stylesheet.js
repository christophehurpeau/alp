var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _jsxFileName = 'helmet/Stylesheet.jsx',
    _this = this;

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';
import { Helmet } from 'fody';
import assetUrl from './assetUrl';

var Stylesheet = function Stylesheet(_ref, _ref2) {
  var href = _ref.href,
      props = _objectWithoutProperties(_ref, ['href']);

  var context = _ref2.context;

  var version = context.config.get('version');

  return React.createElement(Helmet, { link: [_extends({ rel: 'stylesheet', href: assetUrl(href, version) }, props)], __self: _this,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 8
    }
  });
};

Stylesheet.propTypes = {
  href: PropTypes.string.isRequired
};

Stylesheet.contextProps = {
  context: PropTypes.shape({ config: PropTypes.instanceOf(Map) }).isRequired
};

export default Stylesheet;
//# sourceMappingURL=Stylesheet.js.map