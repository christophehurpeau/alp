import { createAppNodeCompiler, watchAndRunCompiler } from 'pobpack-node/src';
import createPobpackConfig from './createPobpackConfig';

export const createNodeCompiler = (production) =>
  createAppNodeCompiler(createPobpackConfig('node', production));

export const watchAndRun = (nodeCompiler, port) => (
  watchAndRunCompiler(nodeCompiler, {
    key: 'alp-dev:watch',
    args: ['--port', port],
    cwd: nodeCompiler.webpackConfig.output.path,
  })
);
