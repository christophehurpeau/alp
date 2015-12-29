'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = buildRouter;
function buildRouter(builder) {
    builder.add('default', '/${action}?', 'site.index', { extension: 'html' });
}
//# sourceMappingURL=routerBuilder.js.map
