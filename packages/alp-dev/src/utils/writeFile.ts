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
          reject(
            new Error(
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
              `Failed to write file "${target}": ${err.message || err}`,
            ),
          );
          return;
        }

        resolve();
      });
    });
  });
}
