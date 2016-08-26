import { readdir, stat as fsStat } from 'fs';

export default function readRecursiveDirectory(directory, callback) {
  return new Promise((resolve, reject) => {
    readdir(directory, (err, files) => {
      if (err) return reject(err);

      Promise.all(files.map((file) => {
        const path = `${directory}/${file}`;
        return new Promise((resolve, reject) => {
          fsStat(path, (err, stat) => {
            if (err) return reject(err);

            if (stat && stat.isDirectory()) {
              return readRecursiveDirectory(path, callback)
                .then(resolve)
                .catch(reject);
            }
            try {
              Promise.resolve(callback({
                filename: file,
                path: path,
                basedir: directory,
                stat: stat,
              }))
                .then(resolve)
                .catch(reject);
            } catch (err) {
              return reject(err);
            }
          });
        });
      })).then(() => resolve());
    });
  });
}
