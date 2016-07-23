import { randomBytes } from 'crypto';
import promiseCallback from 'promise-callback-factory';

export function randomBase64(size) {
    return promiseCallback(function (done) {
        return randomBytes(size, done);
    }).then(function (buffer) {
        return buffer.toString('base64');
    });
}

export function randomHex(size) {
    return promiseCallback(function (done) {
        return randomBytes(size, done);
    }).then(function (buffer) {
        return buffer.toString('hex');
    });
}
//# sourceMappingURL=generators.js.map