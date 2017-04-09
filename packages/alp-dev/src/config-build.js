const glob = require('glob');
const readFile = require('./utils/readFile');
const writeFile = require('./utils/writeFile');
const { dirname, join } = require('path');
const loadConfigFile = require('./utils/loadConfigFile');

export const clean = () => {

};

export const build = (src = './src/config') => (
  Promise.all(glob.sync(join(src, '**/*.yml')).map((filename) => (
    readFile(filename).then((content) => {
      const [serverConfig, browserConfig] = loadConfigFile(
        content,
        dirname(filename)
      );
      const destFile = `${filename.slice('src/'.length, -'yml'.length)}json`;

      return Promise.all([
        writeFile(`build/${destFile}`, JSON.stringify(serverConfig)),
        writeFile(`public/${destFile}`, JSON.stringify(browserConfig)),
      ]);
    })
  )))
);

export const watch = (envs) => {

};

