import React from 'react';

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

import { PropTypes } from 'react';

TranslateComponent.propTypes = {
    id: PropTypes.string.isRequired
};

TranslateComponent.contextTypes = {
    context: PropTypes.object.isRequired
};

export default function TranslateComponent(_ref, _ref2) {
    var id = _ref.id;

    var props = _objectWithoutProperties(_ref, ['id']);

    var context = _ref2.context;

    return React.createElement(
        'span',
        null,
        context.t(id, props)
    );
}
//# sourceMappingURL=index.js.map