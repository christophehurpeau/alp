import { dirname, join } from 'path';
import { FSWatcher, watch as fsWatch } from 'fs';
import glob from 'glob';
import readFile from './utils/readFile';
import writeFile from './utils/writeFile';
import loadConfigFile from './utils/loadConfigFile';

export const clean = () => {};

const compileYml = async (filename: string) => {
  const content = await readFile(filename);

  const [serverConfig, browserConfig] = loadConfigFile(
    content,
    dirname(filename),
  );
  const destFile = `${filename.slice('src/'.length, -'yml'.length)}json`;

  return Promise.all([
    writeFile(`build/${destFile}`, JSON.stringify(serverConfig)),
    writeFile(`public/${destFile}`, JSON.stringify(browserConfig)),
  ]);
};

export const build = (
  src = './src/config',
  onChanged?: () => void,
): Promise<any> =>
  Promise.all(
    glob.sync(join(src, '**/*.yml')).map(
      async (filename: string): Promise<() => void> => {
        const compilePromise = compileYml(filename);

        if (onChanged) {
          const fsWatcher: FSWatcher = fsWatch(
            filename,
            { persistent: false, recursive: false },
            (eventType: string): void => {
              console.log(eventType, filename);
              if (eventType === 'change') {
                compileYml(filename).then(() => {
                  onChanged();
                });
              }
            },
          );

          await compilePromise;

          return () => fsWatcher.close();
        }

        return () => {};
      },
    ),
  ).then((closeFns: (() => void)[]) => () => {
    closeFns.forEach((closeFn) => closeFn());
  });

export const watch = (envs: string[]) => {};
