import fs from 'fs';

export default (target: string): Promise<string> =>
  new Promise((resolve, reject) => {
    fs.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        return reject(
          new Error(`Failed to read file "${target}": ${err.message || err}`),
        );
      }

      resolve(content);
    });
  });
