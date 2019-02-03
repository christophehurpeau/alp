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
  src: string = './src/config',
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
            async (eventType: string) => {
              console.log(eventType, filename);
              if (eventType === 'change') {
                await compileYml(filename);
                onChanged();
              }
            },
          );

          await compilePromise;

          return () => fsWatcher.close();
        }

        return () => {};
      },
    ),
  ).then((closeFns: Array<() => void>) => () => {
    closeFns.forEach((closeFn) => closeFn());
  });

export const watch = (envs: Array<string>) => {};