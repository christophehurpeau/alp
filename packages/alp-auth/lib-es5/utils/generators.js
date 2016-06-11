'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.randomBase64 = randomBase64;
exports.randomHex = randomHex;

var _crypto = require('crypto');

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randomBase64(size) {
    return (0, _promiseCallbackFactory2.default)(function (done) {
        return (0, _crypto.randomBytes)(size, done);
    }).then(function (buffer) {
        return buffer.toString('base64');
    });
}

function randomHex(size) {
    return (0, _promiseCallbackFactory2.default)(function (done) {
        return (0, _crypto.randomBytes)(size, done);
    }).then(function (buffer) {
        return buffer.toString('hex');
    });
}
//# sourceMappingURL=generators.js.map