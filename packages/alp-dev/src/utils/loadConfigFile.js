const { readFileSync } = require('fs');
const path = require('path');
const { safeLoad: saveLoadYml } = require('js-yaml');

module.exports = function loadConfigFile(content, dest, dirname) {
  let data = saveLoadYml(content) || {};

  const config = data.common || {};
  if (dest === 'server') {
    Object.assign(config, data.server || {});
  } else if (dest === 'browser') {
    Object.assign(config, data.browser || {});
  } else {
    throw new Error('gulp-config: unknown destination');
  }

  if (data.include) {
    const includePaths = data.include.map(includePath => path.resolve(dirname, includePath));
    includePaths
      .map(includePath => readFileSync(includePath))
      .map((content, index) => loadConfigFile(content, dest, path.dirname(includePaths[index])))
      .forEach(includeConfig => {
        Object.keys(includeConfig).forEach(key => {
          if (!(key in config)) {
            config[key] = includeConfig[key];
            return;
          }
          if (Array.isArray(config[key])) {
            config[key].push(includeConfig[key]);
          } else if (typeof config[key] === 'object') {
            Object.assign(config[key], includeConfig[key]);
          } else {
            throw new Error(`Unexpected override "${key}", filename = ${includePaths[key]}`);
          }
        });
      });
  }

  return config;
};
