'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readRecursiveDirectory;

var _fs = require('fs');

function readRecursiveDirectory(directory, callback) {
  return new Promise((resolve, reject) => {
    (0, _fs.readdir)(directory, (err, files) => {
      if (err) return reject(err);

      Promise.all(files.map(file => {
        const path = `${ directory }/${ file }`;
        return new Promise((resolve, reject) => {
          (0, _fs.stat)(path, (err, stat) => {
            if (err) return reject(err);

            if (stat && stat.isDirectory()) {
              return readRecursiveDirectory(path, callback).then(resolve).catch(reject);
            }
            try {
              Promise.resolve(callback({
                filename: file,
                path: path,
                basedir: directory,
                stat: stat
              })).then(resolve).catch(reject);
            } catch (err) {
              return reject(err);
            }
          });
        });
      })).then(() => {
        return resolve();
      });
    });
  });
}
//# sourceMappingURL=readRecursiveDirectory.js.map