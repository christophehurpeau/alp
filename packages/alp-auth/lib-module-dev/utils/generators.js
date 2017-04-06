import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

import t from 'flow-runtime';
export function randomBase64(size) {
  var _sizeType = t.number();

  var _returnType = t.return(t.string());

  t.param('size', _sizeType).assert(size);

  return promiseCallback(function (done) {
    return randomBytes(size, done);
  }).then(function (buffer) {
    return buffer.toString('base64');
  }).then(function (_arg) {
    return _returnType.assert(_arg);
  });
}

export function randomHex(size) {
  var _sizeType2 = t.number();

  var _returnType2 = t.return(t.string());

  t.param('size', _sizeType2).assert(size);

  return promiseCallback(function (done) {
    return randomBytes(size, done);
  }).then(function (buffer) {
    return buffer.toString('hex');
  }).then(function (_arg2) {
    return _returnType2.assert(_arg2);
  });
}
//# sourceMappingURL=generators.js.map