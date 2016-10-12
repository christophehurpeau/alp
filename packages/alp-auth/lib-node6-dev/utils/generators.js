'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomBase64 = randomBase64;
exports.randomHex = randomHex;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _crypto = require('crypto');

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randomBase64(size) {
  _assert(size, _tcombForked2.default.Number, 'size');

  return _assert(function () {
    return (0, _promiseCallbackFactory2.default)(done => (0, _crypto.randomBytes)(size, done)).then(buffer => buffer.toString('base64'));
  }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
}

function randomHex(size) {
  _assert(size, _tcombForked2.default.Number, 'size');

  return _assert(function () {
    return (0, _promiseCallbackFactory2.default)(done => (0, _crypto.randomBytes)(size, done)).then(buffer => buffer.toString('hex'));
  }.apply(this, arguments), _tcombForked2.default.Promise, 'return value');
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=generators.js.map