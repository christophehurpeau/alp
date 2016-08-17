var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';

LinkComponent.propTypes = {
    to: PropTypes.string,
    params: PropTypes.object,
    children: PropTypes.node
};

LinkComponent.contextTypes = {
    context: PropTypes.object
};

export default function LinkComponent(_ref, _ref2) {
    var _ref$to = _ref.to;
    var to = _ref$to === undefined ? 'default' : _ref$to;
    var params = _ref.params;
    var children = _ref.children;

    var props = _objectWithoutProperties(_ref, ['to', 'params', 'children']);

    var ctx = _ref2.context;

    return React.createElement(
        'a',
        _extends({ href: ctx.urlGenerator(to, params) }, props),
        children
    );
}
//# sourceMappingURL=index.js.map