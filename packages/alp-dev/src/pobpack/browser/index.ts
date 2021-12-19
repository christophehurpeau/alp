import type { Stats } from 'webpack';
import type { Options, PobpackCompiler, CreateCompilerOptions } from '../types';
import { createPobpackCompiler, createAppWebpackConfig } from '../utils';
import type { BrowserTargetType } from './createBrowserWebpackConfig';
import createBrowserWebpackConfig, {
  TARGETS,
  ALL,
  MODERN,
} from './createBrowserWebpackConfig';

export { TARGETS, ALL, MODERN };

export const createAppBrowserCompiler = (
  target: BrowserTargetType,
  options: Partial<Options>,
  compilerOptions?: CreateCompilerOptions,
): PobpackCompiler =>
  createPobpackCompiler(
    target,
    createAppWebpackConfig(createBrowserWebpackConfig(target))({
      entries: [{ key: target, path: 'index' }], // override default entry
      ...options,
      paths: { build: 'public', ...options.paths },
    }),
    compilerOptions,
  );

export const build = (options = {}): Promise<Stats | undefined>[] => {
  if (!process.env.NODE_ENV) process.env.NODE_ENV = 'production';
  const compilers = TARGETS.map((t) =>
    createAppBrowserCompiler(t, { ...options, hmr: false }),
  );
  compilers[0].clean();
  return compilers.map((compiler) => compiler.run());
};

// export const watchAndRunDevServer = (
//   options: Partial<Options>,
//   runOptions: RunOptions,
// ): PobpackBrowserCompiler => {
//   const url = `http${runOptions.https ? 's' : ''}://localhost:${
//     runOptions.port
//   }`;
//   const compiler: PobpackCompiler = createAppBrowserCompiler(
//     MODERN,
//     { ...options, hmr: true },
//     {
//       successMessage: `Your application is running here: ${url}`,
//     },
//   );
//   compiler.clean();
//   const webpackDevServer = runDevServer(compiler, runOptions);
//   return { ...compiler, webpackDevServer };
// };
