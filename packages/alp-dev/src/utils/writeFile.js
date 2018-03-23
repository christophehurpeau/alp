import fs from 'fs';
import path from 'path';
import mkdirp from 'mkdirp';

export default (target, content) =>
  new Promise((resolve, reject) => {
    mkdirp(path.dirname(target), () => {
      fs.writeFile(target, content, err => {
        if (err) {
          return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
