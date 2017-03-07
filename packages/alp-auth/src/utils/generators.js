import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

export function randomBase64(size: number): Promise<string> {
  return promiseCallback(done => randomBytes(size, done))
        .then(buffer => buffer.toString('base64'));
}

export function randomHex(size: number): Promise<string> {
  return promiseCallback(done => randomBytes(size, done))
        .then(buffer => buffer.toString('hex'));
}
