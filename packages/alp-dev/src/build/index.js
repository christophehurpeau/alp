import { resolve as pathResolve } from 'path';
import execa from 'execa';
import { execSync } from 'child_process';
import { clean, build } from '../config-build';

execSync(`rm -Rf ${pathResolve('public')}/* ${pathResolve('build')}/*`);

clean();

Promise.all([
  build(),
  ...[
    './node',
    './modern-browser',
    './older-browser',
  ].map((path) => {
    const instance = execa('node', [require.resolve(path)]);
    instance.stdout.pipe(process.stdout);
    return instance;
  }),
]).then(() => {
  console.log('done !');
});
