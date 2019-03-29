import argv from 'minimist-argv';
import path from 'path';
import { createAppBrowserCompiler, MODERN, runDevServer as runDevServer$1 } from 'pobpack-browser';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import autoprefixer from 'autoprefixer';
import { createModuleRules } from 'ynnub-webpack-config';

var createPobpackConfig = ((target, production = false) => ({
  env: process.env.NODE_ENV,
  hmr: !production,
  typescript: true,
  includeModules: ['ynnub'],
  paths: {
    build: target === 'node' ? 'build' : 'public'
  },
  entries: [{
    key: // eslint-disable-next-line no-nested-ternary
    target === 'node' ? 'index' : target === 'browser' ? 'es5' : 'modern-browsers',
    path: target === 'node' ? 'index.server.ts' : 'index.browser.ts'
  }],
  resolveLoaderModules: [path.join(__dirname, '../..', 'node_modules'), 'node_modules'],
  babel: {
    minified: target !== 'node' && production,
    comments: !(target !== 'node' && production),
    presets: [// add react preset with jsx
    [require.resolve('@babel/preset-react'), {
      development: !production,
      useBuiltIns: true
    }], // pob preset: flow, import `src`, export default function name, replacements, exnext features, ...
    [require.resolve('babel-preset-pob-env'), {
      resolvePreset: preset => require.resolve(preset),
      production,
      typescript: true,
      exportDefaultName: false,
      optimizations: true,
      target: target === 'node' ? 'node' : 'browser',
      version: // eslint-disable-next-line no-nested-ternary
      target === 'node' ? 8.3 : target === 'modern-browser' ? 'modern' : undefined,
      loose: true,
      modules: false
    }]].filter(Boolean),
    plugins: [require.resolve('babel-plugin-inline-classnames-babel7')]
  },
  moduleRules: [// SCSS RULE, CSS RULE
  ...createModuleRules({
    target,
    extractLoader: MiniCssExtractPlugin.loader,
    production,
    themeFile: './src/theme.scss',
    plugins: [autoprefixer],
    includePaths: [path.resolve('./node_modules')],
    resolveLoader: loader => require.resolve(loader)
  }), // IMG RULE
  {
    test: /\.(png|jpg|jpeg|gif|svg)$/,
    loader: require.resolve('url-loader'),
    options: {
      /* config to emit with node doesn't work anymore because css is ignored by node */
      // emitFile: target === 'node', // only write file if node
      // outputPath: '../public/', // because it's node who is writing the file, node is in build/
      // publicPath: (url: string): string => url.replace(/^..\/public\//, ''),
      emitFile: target === 'modern-browser',
      limit: 1000,
      name: 'images/[hash].[ext]'
    }
  }],
  // TODO https://github.com/zeit/next.js/blob/7d78c3b64185d6d6417f1af9cde4a69d32b18cc6/packages/next/build/webpack.js
  // optimization: {
  //   minimizer:
  //     target === 'browser' ? [new OptimizeCssAssetsPlugin()] : undefined,
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: stylesCacheGroups,
  //     },
  //   },
  // },
  plugins: [new MiniCssExtractPlugin({
    // disable: target === 'node',
    filename: `${// eslint-disable-next-line no-nested-ternary
    target === 'node' ? 'server' : target === 'browser' ? 'es5' : 'modern-browsers'}.css`
  }), new OptimizeCssAssetsPlugin()].filter(Boolean)
}));

const createModernBrowserCompiler = production => createAppBrowserCompiler(MODERN, createPobpackConfig('modern-browser', production));
const runDevServer = (compiler, port, proxyPort, options) => runDevServer$1(compiler, {
  port: proxyPort,
  https: false,
  contentBase: path.resolve('public'),
  watchContentBase: true,
  headers: {
    // avoid errors in console
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap'
  },
  proxy: {
    '**': `http://localhost:${port}`
  },
  ...options
});

const browserCompiler = createModernBrowserCompiler(false);
runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host
});
//# sourceMappingURL=watch-browser-node10.es.js.map
