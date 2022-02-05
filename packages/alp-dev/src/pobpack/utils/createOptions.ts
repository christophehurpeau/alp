/* eslint-disable complexity */
import type { Options } from '../types';

export default function createOptions(options: Partial<Options>): Options {
  return {
    aliases: options.aliases || {},
    babel: options.babel || {},
    defines: options.defines || {},
    entries: options.entries || ['index'],
    serviceWorkerEntry:
      options.serviceWorkerEntry === undefined
        ? 'service-worker'
        : options.serviceWorkerEntry,
    env: options.env || process.env.NODE_ENV,
    hmr: options.hmr,
    allowlistExternalExtensions: options.allowlistExternalExtensions || [],
    includePaths: options.includePaths || [],
    moduleRules: options.moduleRules,
    jsModuleRules: options.jsModuleRules,
    paths: { src: 'src', build: 'build', ...options.paths },
    plugins: options.plugins || [],
    prependPlugins: options.prependPlugins || [],
    resolveLoaderModules: options.resolveLoaderModules,
    typescript: options.typescript || false,
    webpackPrefixPackageFields: options.webpackPrefixPackageFields || [],
  };
}
