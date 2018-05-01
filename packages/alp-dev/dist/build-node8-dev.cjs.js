'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fs = require('fs');
var fs__default = _interopDefault(fs);
var path = require('path');
var path__default = _interopDefault(path);
var mkdirp = _interopDefault(require('mkdirp'));
var jsYaml = require('js-yaml');
var glob = _interopDefault(require('glob'));
var child_process = require('child_process');
var execa = _interopDefault(require('execa'));

var readFile = (target => new Promise((resolve, reject) => {
  fs__default.readFile(target, (err, content) => {
    if (err) {
      return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
    }

    resolve(content);
  });
}));

var writeFile = ((target, content) => new Promise((resolve, reject) => {
  mkdirp(path__default.dirname(target), () => {
    fs__default.writeFile(target, content, err => {
      if (err) {
        return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
      }

      resolve();
    });
  });
}));

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function loadConfigFile(content, dirname) {
  const data = jsYaml.safeLoad(content) || {};
  const config = data.shared || data.common || {};

  const serverConfig = _objectSpread({}, config, data.server);

  const browserConfig = _objectSpread({}, config, data.browser);

  if (data.include) {
    const includePaths = data.include.map(includePath => path__default.resolve(dirname, includePath));
    includePaths.map(includePath => fs.readFileSync(includePath)).map((content, index) => loadConfigFile(content, path__default.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
      [{
        config: serverConfig,
        include: includeServerConfig
      }, {
        config: browserConfig,
        include: includeBrowserConfig
      }].forEach(({
        config,
        include
      }) => Object.keys(include).forEach(key => {
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
}

const build = (src = './src/config') => Promise.all(glob.sync(path.join(src, '**/*.yml')).map(filename => readFile(filename).then(content => {
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
})));

child_process.execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);
Promise.all([build(), ...['build-node', 'build-modern-browser', 'build-older-browser'].map(path$$1 => {
  const instance = execa('node', [__filename.replace('/build-', `/${path$$1}-`)]);
  instance.stdout.pipe(process.stdout);
  return instance;
})]).then(() => {
  console.log('done !');
});
//# sourceMappingURL=build-node8-dev.cjs.js.map
