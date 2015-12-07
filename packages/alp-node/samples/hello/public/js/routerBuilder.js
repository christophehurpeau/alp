'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports['default'] = buildRouter;

function buildRouter(builder) {
    builder.add('default', '/${action}?', 'site.index', { extension: 'html' });
}

module.exports = exports['default'];
//# sourceMappingURL=routerBuilder.js.map
