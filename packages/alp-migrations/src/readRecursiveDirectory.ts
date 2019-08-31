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
): Promise<void> {
  return new Promise((resolve, reject): void => {
    readdir(directory, (errReadDir, files) => {
      if (errReadDir) return reject(errReadDir);

      Promise.all(
        files.map((file) => {
          const path = `${directory}/${file}`;
          return new Promise((resolve, reject): void => {
            fsStat(path, (errFsStat, stat): void => {
              if (errFsStat) return reject(errFsStat);

              if (stat && stat.isDirectory()) {
                readRecursiveDirectory(path, callback)
                  .then(resolve)
                  .catch(reject);
                return;
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
              } catch (err) {
                return reject(err);
              }
            });
          });
        }),
      ).then(() => resolve());
    });
  });
}
