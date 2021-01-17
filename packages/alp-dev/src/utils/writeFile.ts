import fs from 'fs';
import path from 'path';

export default function writeFile(
  target: string,
  content: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(target), { recursive: true }, () => {
      fs.writeFile(target, content, (err) => {
        if (err) {
          return reject(
            new Error(
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              `Failed to write file "${target}": ${err.message || err}`,
            ),
          );
        }

        resolve();
      });
    });
  });
}
