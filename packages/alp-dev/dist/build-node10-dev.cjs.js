'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var child_process = require('child_process');
var path = require('path');
var path__default = _interopDefault(path);
var execa = _interopDefault(require('execa'));
var fs = require('fs');
var fs__default = _interopDefault(fs);
var glob = _interopDefault(require('glob'));
var mkdirp = _interopDefault(require('mkdirp'));
var jsYaml = require('js-yaml');

var readFile = (target => new Promise((resolve, reject) => {
  fs__default.readFile(target, 'utf-8', (err, content) => {
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

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, path.dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob.sync(path.join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = fs.watch(filename, {
      persistent: false,
      recursive: false
    }, async eventType => {
      console.log(eventType, filename);

      if (eventType === 'change') {
        await compileYml(filename);
        onChanged();
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
Promise.all([build(), ...['build-node', 'build-modern-browser', 'build-older-browser'].map(path$$1 => {
  const instance = execa('node', [__filename.replace('/build-', `/${path$$1}-`)]);
  instance.stdout.pipe(process.stdout);
  return instance;
})]).then(() => {
  console.log('done !');
}, err => {
  console.error(err); // eslint-disable-next-line unicorn/no-process-exit

  process.exit(1);
});
//# sourceMappingURL=build-node10-dev.cjs.js.map