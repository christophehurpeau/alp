import { readdir, stat as fsStat, Stats } from 'fs';

export interface CallbackParam {
  filename: string;
  basedir: string;
  path: string;
  stat: Stats;
}

export default function readRecursiveDirectory(
  directory: string,
  callback: (param: CallbackParam) => void | Promise<void>,
) {
  return new Promise((resolve, reject) => {
    readdir(directory, (err, files) => {
      if (err) return reject(err);

      Promise.all(
        files.map((file) => {
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
                Promise.resolve(
                  callback({
                    filename: file,
                    basedir: directory,
                    path,
                    stat,
                  }),
                )
                  .then(() => resolve())
                  .catch(reject);
              } catch (err2) {
                return reject(err2);
              }
            });
          });
        }),
      ).then(() => resolve());
    });
  });
}
