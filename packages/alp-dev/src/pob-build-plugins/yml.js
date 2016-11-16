import writeFile from 'pob-babel/lib/utils/writeFile';
import { dirname } from 'path';
import loadConfigFile from '../utils/loadConfigFile';

module.exports = {
  extension: 'yml',
  destExtension: 'json',

  transform(content, { src }) {
    let [serverConfig, browserConfig] = loadConfigFile(content, dirname(src));

    return writeFile(
      `public/${src.slice('src/'.length, -'yml'.length)}json`,
      JSON.stringify(browserConfig),
    ).then(() => ({ code: JSON.stringify(serverConfig), map: null }));
  },
};
