'use strict';

const child_process = require('child_process');
const path = require('path');
const execa = require('execa');
const fs = require('fs');
const glob = require('glob');
const jsYaml = require('js-yaml');
const mkdirp = require('mkdirp');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const path__default = /*#__PURE__*/_interopDefaultLegacy(path);
const execa__default = /*#__PURE__*/_interopDefaultLegacy(execa);
const fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
const glob__default = /*#__PURE__*/_interopDefaultLegacy(glob);
const mkdirp__default = /*#__PURE__*/_interopDefaultLegacy(mkdirp);

function loadConfigFile(content, dirname) {
  const data = jsYaml.safeLoad(content) || {};
  const config = data.shared || data.common || {};
  const serverConfig = { ...config,
    ...data.server
  };
  const browserConfig = { ...config,
    ...data.browser
  };

  if (data.include) {
    const includePaths = data.include.map(includePath => path__default.resolve(dirname, includePath));
    includePaths.map(includePath => fs.readFileSync(includePath, 'utf-8')).map((content, index) => loadConfigFile(content, path__default.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
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
          throw new TypeError(`Unexpected override "${key}", filename = ${includePaths[key]}`);
        }
      }));
    });
  }

  return [serverConfig, browserConfig];
}

function readFile(target) {
  return new Promise((resolve, reject) => {
    fs__default.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
      }

      resolve(content);
    });
  });
}

function writeFile(target, content) {
  return new Promise((resolve, reject) => {
    mkdirp__default(path__default.dirname(target), () => {
      fs__default.writeFile(target, content, err => {
        if (err) {
          return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
        }

        resolve();
      });
    });
  });
}

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob__default.sync(path.join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = fs.watch(filename, {
      persistent: false,
      recursive: false
    }, eventType => {
      console.log(eventType, filename);

      if (eventType === 'change') {
        compileYml(filename).then(() => {
          onChanged();
        });
      }
    });
    await compilePromise;
    return () => fsWatcher.close();
  }

  return () => {};
})).then(closeFns => () => {
  closeFns.forEach(closeFn => closeFn());
});

child_process.execSync(`rm -Rf ${path.resolve('public')}/* ${path.resolve('build')}/*`);
Promise.all([build(), ...['build-node', 'build-modern-browser', 'build-older-browser'].map(path => {
  const instance = execa__default('node', [__filename.replace('/build-', `/${path}-`)]);
  if (instance.stdout) instance.stdout.pipe(process.stdout);
  return instance;
})]).then(() => {
  console.log('done !');
}, err => {
  console.error(err);
  process.exit(1);
});
//# sourceMappingURL=build-node12.cjs.js.map
