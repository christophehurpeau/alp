'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _delegates = require('delegates');

var _delegates2 = _interopRequireDefault(_delegates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proto = {};

(0, _delegates2.default)(proto, 'response').access('body').method('redirect');

(0, _delegates2.default)(proto, 'request').getter('host').getter('hostname').getter('href').getter('origin').getter('path').getter('protocol').getter('query').getter('url').getter('search').getter('searchParams');

exports.default = proto;
//# sourceMappingURL=context.js.map