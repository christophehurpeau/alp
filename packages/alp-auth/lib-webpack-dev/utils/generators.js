import _t from 'tcomb-forked';
import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

export function randomBase64(size) {
  _assert(size, _t.Number, 'size');

  return _assert(function () {
    return promiseCallback(function (done) {
      return randomBytes(size, done);
    }).then(function (buffer) {
      return buffer.toString('base64');
    });
  }.apply(this, arguments), _t.Promise, 'return value');
}

export function randomHex(size) {
  _assert(size, _t.Number, 'size');

  return _assert(function () {
    return promiseCallback(function (done) {
      return randomBytes(size, done);
    }).then(function (buffer) {
      return buffer.toString('hex');
    });
  }.apply(this, arguments), _t.Promise, 'return value');
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _t.stringify(x) + ' supplied to ' + name + ' (expected a ' + _t.getTypeName(type) + ')';
  }

  if (_t.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _t.getTypeName(type)]);

      _t.fail(message());
    }
  } else if (!(x instanceof type)) {
    _t.fail(message());
  }

  return x;
}
//# sourceMappingURL=generators.js.map