import React from 'react';
import { PropTypes } from 'react';

TranslateComponent.propTypes = {
    id: PropTypes.string.isRequired,
    children: PropTypes.func
};

TranslateComponent.contextTypes = {
    context: PropTypes.object.isRequired
};

export default function TranslateComponent({ id, children, ...props }, { context }) {
    var translated = context.t(id, props);

    if (children) {
        return children(translated);
    }

    return React.createElement(
        'span',
        null,
        translated
    );
}
//# sourceMappingURL=index.js.map