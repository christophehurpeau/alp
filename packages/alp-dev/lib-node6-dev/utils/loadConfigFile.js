'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const { readFileSync } = require('fs');
const path = require('path');
const { safeLoad: saveLoadYml } = require('js-yaml');

module.exports = function loadConfigFile(content, dirname) {
  let data = saveLoadYml(content) || {};

  const config = data.shared || data.common || {};
  const serverConfig = _extends({}, config, data.server);
  const browserConfig = _extends({}, config, data.browser);

  if (data.include) {
    const includePaths = data.include.map(includePath => path.resolve(dirname, includePath));
    includePaths.map(includePath => readFileSync(includePath)).map((content, index) => loadConfigFile(content, path.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
      [{ config: serverConfig, include: includeServerConfig }, { config: browserConfig, include: includeBrowserConfig }].forEach(({ config, include }) => Object.keys(include).forEach(key => {
        if (!(key in config)) {
          config[key] = include[key];
          return;
        }
        if (Array.isArray(config[key])) {
          config[key].push(include[key]);
        } else if (typeof config[key] === 'object') {
          Object.assign(config[key], include[key]);
        } else {
          throw new Error(`Unexpected override "${key}", filename = ${includePaths[key]}`);
        }
      }));
    });
  }

  return [serverConfig, browserConfig];
};
//# sourceMappingURL=loadConfigFile.js.map