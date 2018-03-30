import { execSync } from 'child_process';
import { resolve as pathResolve } from 'path';
import execa from 'execa';
import { clean, build } from './config-build';

execSync(`rm -Rf ${pathResolve('public')}/* ${pathResolve('build')}/*`);

clean();

Promise.all([
  build(),
  ...['build-node', 'build-modern-browser', 'build-older-browser'].map(path => {
    const instance = execa('node', [__filename.replace('/build-', `/${path}-`)]);
    instance.stdout.pipe(process.stdout);
    return instance;
  }),
]).then(() => {
  console.log('done !');
});
