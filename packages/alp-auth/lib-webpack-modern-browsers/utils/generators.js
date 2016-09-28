import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

export function randomBase64(size) {
  return promiseCallback(done => randomBytes(size, done)).then(buffer => buffer.toString('base64'));
}

export function randomHex(size) {
  return promiseCallback(done => randomBytes(size, done)).then(buffer => buffer.toString('hex'));
}
//# sourceMappingURL=generators.js.map