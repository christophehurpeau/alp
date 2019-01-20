import { execSync } from 'child_process';
import path, { join, dirname, resolve } from 'path';
import execa from 'execa';
import fs, { readFileSync, watch } from 'fs';
import glob from 'glob';
import mkdirp from 'mkdirp';
import { safeLoad } from 'js-yaml';

var readFile = (target => new Promise((resolve$$1, reject) => {
  fs.readFile(target, 'utf-8', (err, content) => {
    if (err) {
      return reject(new Error(`Failed to read file "${target}": ${err.message || err}`));
    }

    resolve$$1(content);
  });
}));

var writeFile = ((target, content) => new Promise((resolve$$1, reject) => {
  mkdirp(path.dirname(target), () => {
    fs.writeFile(target, content, err => {
      if (err) {
        return reject(new Error(`Failed to write file "${target}": ${err.message || err}`));
      }

      resolve$$1();
    });
  });
}));

function loadConfigFile(content, dirname$$1) {
  const data = safeLoad(content) || {};
  const config = data.shared || data.common || {};
  const serverConfig = { ...config,
    ...data.server
  };
  const browserConfig = { ...config,
    ...data.browser
  };

  if (data.include) {
    const includePaths = data.include.map(includePath => path.resolve(dirname$$1, includePath));
    includePaths.map(includePath => readFileSync(includePath, 'utf-8')).map((content, index) => loadConfigFile(content, path.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
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
  const [serverConfig, browserConfig] = loadConfigFile(content, dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  return Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob.sync(join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = watch(filename, {
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

execSync(`rm -Rf ${resolve('public')}/* ${resolve('build')}/*`);
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
//# sourceMappingURL=build-node10-dev.es.js.map
