import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

import t from 'flow-runtime';
export function randomBase64(size) {
  let _sizeType = t.number();

  const _returnType = t.return(t.ref('Promise', t.string()));

  t.param('size', _sizeType).assert(size);

  return _returnType.assert(promiseCallback(function (done) {
    return randomBytes(size, done);
  }).then(function (buffer) {
    return buffer.toString('base64');
  }));
}

export function randomHex(size) {
  let _sizeType2 = t.number();

  const _returnType2 = t.return(t.ref('Promise', t.string()));

  t.param('size', _sizeType2).assert(size);

  return _returnType2.assert(promiseCallback(function (done) {
    return randomBytes(size, done);
  }).then(function (buffer) {
    return buffer.toString('hex');
  }));
}
//# sourceMappingURL=generators.js.map