import { execSync } from 'child_process';
import { promisify } from 'util';
import type { Stats } from 'webpack';
import webpack from 'webpack';
import type {
  PobpackCompiler,
  CreateCompilerOptions,
  FilledWebpackConfiguration,
} from '../types';
import FriendlyErrorsWebpackPlugin from './FriendlyErrorsWebpackPlugin';

const buildThrowOnError = (stats?: Stats): Stats | undefined => {
  if (!stats) return stats;
  if (!stats.hasErrors()) {
    return stats;
  }

  throw new Error(stats.toString({}));
};

export function createPobpackCompiler(
  bundleName: string,
  webpackConfig: FilledWebpackConfiguration,
  { successMessage }: CreateCompilerOptions = {},
): PobpackCompiler {
  const compiler = webpack(webpackConfig);

  // human-readable error messages
  new FriendlyErrorsWebpackPlugin({ bundleName, successMessage }).apply(
    compiler,
  );

  const promisifyRun: () => Promise<Stats | undefined> = promisify(
    compiler.run.bind(compiler),
  );

  return {
    compiler,
    webpackConfig,
    clean: (): undefined => {
      if (webpackConfig.output?.path) {
        execSync(`rm -Rf ${webpackConfig.output.path}`);
      }
      return undefined;
    },
    run: (): Promise<Stats | undefined> =>
      promisifyRun().then(buildThrowOnError),
    watch: (callback: (stats?: Stats) => unknown) =>
      compiler.watch({}, (err?: Error, stats?: Stats): void => {
        if (err || !stats) return;
        if (stats.hasErrors()) return;
        buildThrowOnError(stats);
        callback(stats);
      }),
  };
}
