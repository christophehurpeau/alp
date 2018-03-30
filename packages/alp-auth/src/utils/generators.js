import { randomBytes } from 'crypto';
import { promisify } from 'util';

const randomBytesPromisified = promisify(randomBytes);

export function randomBase64(size: number): Promise<string> {
  return randomBytesPromisified(size).then(buffer => buffer.toString('base64'));
}

export function randomHex(size: number): Promise<string> {
  return randomBytesPromisified(size).then(buffer => buffer.toString('hex'));
}
