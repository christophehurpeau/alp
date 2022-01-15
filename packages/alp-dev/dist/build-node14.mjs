import { execSync } from 'child_process';
import path, { join, dirname, resolve } from 'path';
import { URL } from 'url';
import { execa } from 'execa';
import fs, { readFileSync, watch } from 'fs';
import glob from 'glob';
import yaml from 'js-yaml';

/* eslint-disable @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment */
function loadConfigFile(content, dirname) {
  const data = yaml.load(content) || {};
  const config = data.shared || data.common || {};
  const serverConfig = { ...config,
    ...data.server
  };
  const browserConfig = { ...config,
    ...data.browser
  };

  if (data.include) {
    const includePaths = data.include.map(includePath => path.resolve(dirname, includePath));
    includePaths.map(includePath => readFileSync(includePath, 'utf-8')).map((fileContent, index) => // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    loadConfigFile(fileContent, path.dirname(includePaths[index]))).forEach(([includeServerConfig, includeBrowserConfig]) => {
      [{
        includeConfig: serverConfig,
        include: includeServerConfig
      }, {
        includeConfig: browserConfig,
        include: includeBrowserConfig
      }].forEach(({
        includeConfig,
        include
      }) => {
        Object.keys(include).forEach(key => {
          if (!(key in includeConfig)) {
            includeConfig[key] = include[key];
            return;
          }

          if (Array.isArray(includeConfig[key])) {
            includeConfig[key].push(include[key]);
          } else if (typeof includeConfig[key] === 'object') {
            Object.assign(includeConfig[key], include[key]);
          } else {
            throw new TypeError(`Unexpected override "${key}", filename = ${includePaths[key]}`);
          }
        });
      });
    });
  }

  return [serverConfig, browserConfig];
}

function readFile(target) {
  return new Promise((resolve, reject) => {
    fs.readFile(target, 'utf-8', (err, content) => {
      if (err) {
        reject( // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
        new Error(`Failed to read file "${target}": ${err.message || err}`));
        return;
      }

      resolve(content);
    });
  });
}

function writeFile(target, content) {
  return new Promise((resolve, reject) => {
    fs.mkdir(path.dirname(target), {
      recursive: true
    }, () => {
      fs.writeFile(target, content, err => {
        if (err) {
          reject(new Error( // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
          `Failed to write file "${target}": ${err.message || err}`));
          return;
        }

        resolve();
      });
    });
  });
}

const clean = () => {};

const compileYml = async filename => {
  const content = await readFile(filename);
  const [serverConfig, browserConfig] = loadConfigFile(content, dirname(filename));
  const destFile = `${filename.slice(4, -3)}json`;
  await Promise.all([writeFile(`build/${destFile}`, JSON.stringify(serverConfig)), writeFile(`public/${destFile}`, JSON.stringify(browserConfig))]);
};

const build = (src = './src/config', onChanged) => Promise.all(glob.sync(join(src, '**/*.yml')).map(async filename => {
  const compilePromise = compileYml(filename);

  if (onChanged) {
    const fsWatcher = watch(filename, {
      persistent: false,
      recursive: false
    }, eventType => {
      console.log(eventType, filename);

      if (eventType === 'change') {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
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

execSync(`rm -Rf ${resolve('public')}/* ${resolve('build')}/*`);
clean();

try {
  await Promise.all([build(), ...['build-node', 'build-modern-browser', 'build-older-browser'].map(async path => {
    await execa(process.argv0, [new URL(import.meta.url).pathname.replace('/build-', `/${path}-`)], {
      stdio: 'inherit'
    });
  })]);
} catch {
  console.error('Failed to build');
  process.exit(1);
}
//# sourceMappingURL=build-node14.mjs.map
