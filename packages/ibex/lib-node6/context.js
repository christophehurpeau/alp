'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _delegates = require('delegates');

var _delegates2 = _interopRequireDefault(_delegates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const proto = {};

(0, _delegates2.default)(proto, 'request').access('host').access('hostname').access('href').access('origin').access('path').access('protocol').access('query').access('url').access('search').access('searchParams');

exports.default = proto;
//# sourceMappingURL=context.js.map