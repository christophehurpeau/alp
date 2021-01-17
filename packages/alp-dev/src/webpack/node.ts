import path from 'path';
import { createAppNodeCompiler, watchAndRunCompiler } from 'pobpack-node';
import type { PobpackCompiler } from 'pobpack-types';
import type { Watching } from 'webpack';
import createPobpackConfig from './createPobpackConfig';

export const createNodeCompiler = (production: boolean) =>
  createAppNodeCompiler(createPobpackConfig('node', production), {
    progressBar: false,
  });

export const watchAndRun = (
  nodeCompiler: PobpackCompiler,
  port: string | number,
): Watching =>
  watchAndRunCompiler(nodeCompiler, {
    key: 'alp-dev:node:watchAndRun',
    displayName: 'node:watchAndRun',
    args: ['--trace-warnings', '--port', port, '--version', Date.now()],
    cwd: path.resolve('.'),
  });
