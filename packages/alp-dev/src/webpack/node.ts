import path from 'path';
import type { Watching } from 'webpack';
import { createAppNodeCompiler, watchAndRunCompiler } from '../pobpack/node';
import type { PobpackCompiler } from '../pobpack/types';
import createPobpackConfig from './createPobpackConfig';

export const createNodeCompiler = (production: boolean): PobpackCompiler =>
  createAppNodeCompiler(createPobpackConfig('node', production), {
    progressBar: false,
  });

export const watchAndRun = (
  nodeCompiler: PobpackCompiler,
  port: string | number,
): Pick<Watching, 'close' | 'invalidate'> =>
  watchAndRunCompiler(nodeCompiler, {
    key: 'alp-dev:node:watchAndRun',
    displayName: 'node:watchAndRun',
    nodeArgs: ['--enable-source-maps'],
    args: ['--trace-warnings', '--port', port, '--version', Date.now()],
    cwd: path.resolve('.'),
  });
