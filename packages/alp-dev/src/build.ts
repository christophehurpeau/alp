import { execSync } from 'child_process';
import { resolve as pathResolve } from 'path';
import { URL } from 'url';
import { execa } from 'execa';
import { clean, build } from './config-build';

execSync(`rm -Rf ${pathResolve('public')}/* ${pathResolve('build')}/*`);

clean();

try {
  await Promise.all([
    build(),
    ...['build-node', 'build-modern-browser', 'build-older-browser'].map(
      async (path) => {
        await execa(
          process.argv0,
          [new URL(import.meta.url).pathname.replace('/build-', `/${path}-`)],
          {
            stdio: 'inherit',
          },
        );
      },
    ),
  ]);
} catch {
  console.error('Failed to build');
  process.exit(1);
}
