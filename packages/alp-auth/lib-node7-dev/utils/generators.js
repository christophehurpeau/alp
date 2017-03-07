'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.randomBase64 = randomBase64;
exports.randomHex = randomHex;

var _crypto = require('crypto');

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function randomBase64(size) {
  let _sizeType = _flowRuntime2.default.number();

  const _returnType = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.string()));

  _flowRuntime2.default.param('size', _sizeType).assert(size);

  return _returnType.assert((0, _promiseCallbackFactory2.default)(done => (0, _crypto.randomBytes)(size, done)).then(buffer => buffer.toString('base64')));
}

function randomHex(size) {
  let _sizeType2 = _flowRuntime2.default.number();

  const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.string()));

  _flowRuntime2.default.param('size', _sizeType2).assert(size);

  return _returnType2.assert((0, _promiseCallbackFactory2.default)(done => (0, _crypto.randomBytes)(size, done)).then(buffer => buffer.toString('hex')));
}
//# sourceMappingURL=generators.js.map