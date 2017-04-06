import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

import t from 'flow-runtime';
export function randomBase64(size) {
  let _sizeType = t.number();

  const _returnType = t.return(t.string());

  t.param('size', _sizeType).assert(size);

  return promiseCallback(done => randomBytes(size, done)).then(buffer => buffer.toString('base64')).then(_arg => _returnType.assert(_arg));
}

export function randomHex(size) {
  let _sizeType2 = t.number();

  const _returnType2 = t.return(t.string());

  t.param('size', _sizeType2).assert(size);

  return promiseCallback(done => randomBytes(size, done)).then(buffer => buffer.toString('hex')).then(_arg2 => _returnType2.assert(_arg2));
}
//# sourceMappingURL=generators.js.map