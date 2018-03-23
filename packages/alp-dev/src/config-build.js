import { dirname, join } from 'path';
import glob from 'glob';
import readFile from './utils/readFile';
import writeFile from './utils/writeFile';
import loadConfigFile from './utils/loadConfigFile';

export const clean = () => {};

export const build = (src = './src/config') =>
  Promise.all(
    glob.sync(join(src, '**/*.yml')).map(filename =>
      readFile(filename).then(content => {
        const [serverConfig, browserConfig] = loadConfigFile(content, dirname(filename));
        const destFile = `${filename.slice('src/'.length, -'yml'.length)}json`;

        return Promise.all([
          writeFile(`build/${destFile}`, JSON.stringify(serverConfig)),
          writeFile(`public/${destFile}`, JSON.stringify(browserConfig)),
        ]);
      }),
    ),
  );

export const watch = envs => {};
