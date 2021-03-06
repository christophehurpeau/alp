import argv from 'minimist-argv';
import path from 'path';
import { createAppBrowserCompiler, MODERN, runDevServer as runDevServer$1 } from 'pobpack-browser';
import fs from 'fs';
import autoprefixer from 'autoprefixer';
import CssExtractPlugin from 'extract-css-chunks-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import webpack from 'webpack';

/* eslint-disable max-lines, complexity */
const ExcludesFalsy$1 = Boolean;

const resolveLoader = loader => require.resolve(loader);

const cssLoaderOptions = function (importLoaders, global, production, targetIsNode) {
  return {
    sourceMap: !production,
    modules: global ? false : {
      exportOnlyLocals: targetIsNode,
      localIdentName: production !== false ? '[hash:base64]' : '[name]__[local]___[hash:base64:5]'
    },
    importLoaders
  };
};

const createCssModuleUse = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  otherLoaders = []
}) {
  if (global && target === 'node') {
    return [{
      loader: resolveLoader('ignore-loader')
    }];
  }

  return [target !== 'node' && extractLoader, {
    loader: resolveLoader('css-loader'),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    options: cssLoaderOptions(otherLoaders.length + 1 + (!global && !production ? 1 : 0), global, production, target === 'node')
  }, !global && !production && target !== 'node' && {
    loader: resolveLoader('typed-css-modules-loader'),
    options: {
      noEmit: true
    }
  }, {
    loader: resolveLoader('postcss-loader'),
    options: {
      ident: 'postcss',
      sourceMap: !production,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      plugins: () => plugins
    }
  }, ...otherLoaders].filter(ExcludesFalsy$1);
};

const createScssModuleUse = function ({
  target,
  extractLoader,
  global = false,
  plugins,
  production,
  themeFile,
  includePaths = []
}) {
  return createCssModuleUse({
    target,
    extractLoader,
    global,
    plugins,
    production,
    otherLoaders: [{
      loader: resolveLoader('sass-loader'),
      options: {
        sourceMap: !production,
        additionalData: `$env: ${process.env.NODE_ENV};${themeFile ? `@import '${path.resolve(themeFile)}';` : ''}`,
        sassOptions: {
          outputStyle: production !== false ? undefined : 'compressed',
          includePaths
        }
      }
    }]
  });
};

const createCssModuleRule = function (options) {
  return {
    test: /\.css$/,
    sideEffects: true,
    use: createCssModuleUse(options)
  };
};
const createModuleRules = function ({
  target,
  extractLoader,
  plugins,
  production,
  themeFile,
  includePaths
}) {
  return [{
    test: /\.scss$/,
    oneOf: [{
      test: /\.global\.scss$/,
      sideEffects: true,
      use: createScssModuleUse({
        target,
        extractLoader,
        global: true,
        plugins,
        production,
        themeFile,
        includePaths
      })
    }, {
      sideEffects: true,
      use: createScssModuleUse({
        target,
        extractLoader,
        global: false,
        plugins,
        production,
        themeFile,
        includePaths
      })
    }]
  }, createCssModuleRule({
    target,
    extractLoader,
    global: false,
    plugins,
    production
  })];
};

/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, complexity, max-lines */

const ExcludesFalsy = Boolean;
function createPobpackConfig(target, production = false) {
  const pkg = JSON.parse(fs.readFileSync(path.resolve('package.json'), 'utf-8'));
  const deps = pkg.dependencies || {};
  const devdeps = pkg.devDependencies || {};
  const hasAntd = !!deps.antd;

  if (deps.antd) {
    if (!devdeps.less) {
      throw new Error('less missing: yarn add --dev less');
    }
  }

  return {
    env: process.env.NODE_ENV,
    hmr: !production,
    typescript: true,
    allowlistExternalExtensions: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'scss', 'css'],
    includeModules: [],
    paths: {
      build: target === 'node' ? 'build' : 'public'
    },
    entries: [{
      key: target === 'node' ? 'index' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers',
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
        optimizations: true,
        target: target === 'node' ? 'node' : 'browser',
        version: target === 'node' ? '12.10' : // eslint-disable-next-line unicorn/no-nested-ternary
        target === 'modern-browser' ? 'modern' : undefined,
        loose: true,
        modules: false
      }]],
      plugins: [// webpack 4 does not support this syntax. Remove with webpack 5
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), // webpack 4 does not support this syntax. Remove with webpack 5
      require.resolve('@babel/plugin-proposal-optional-chaining'), require.resolve('babel-plugin-inline-classnames-babel7'), hasAntd && [require.resolve('babel-plugin-import'), {
        libraryName: 'antd',
        libraryDirectory: target === 'node' ? 'lib' : 'es',
        style: target !== 'node'
      }]].filter(ExcludesFalsy)
    },
    moduleRules: [// webpack 4 does not support this syntax. Remove with webpack 5
    {
      test: /\.(mjs|jsx?)$/,
      include: [/\/node_modules\//],
      loaders: [{
        loader: require.resolve('babel-loader'),
        options: {
          babelrc: false,
          cacheDirectory: false,
          plugins: [require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'), require.resolve('@babel/plugin-proposal-optional-chaining')]
        }
      }]
    }, // SCSS RULE, CSS RULE
    ...createModuleRules({
      target,
      extractLoader: {
        loader: CssExtractPlugin.loader,
        options: {
          hmr: !production && target !== 'node',
          esModule: true
        }
      },
      production,
      themeFile: './src/theme.scss',
      plugins: [autoprefixer],
      includePaths: [path.resolve('./node_modules')]
    }), // LESS RULE (antd)
    {
      test: /\.less$/,
      use: createCssModuleUse({
        global: true,
        target,
        extractLoader: {
          loader: CssExtractPlugin.loader,
          options: {
            hmr: !production && target !== 'node',
            esModule: true
          }
        },
        production,
        plugins: [autoprefixer],
        otherLoaders: [{
          loader: require.resolve('less-loader'),
          options: {
            javascriptEnabled: true // modifyVars: path.resolve('./src/less-modifyVars.js'),

          }
        }, {
          loader: require.resolve('less-modify-var-loader'),
          options: {
            filePath: path.resolve('./src/theme.less')
          }
        }]
      })
    }, // IMG RULE
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
    plugins: [new CssExtractPlugin({
      // disable: target === 'node',
      filename: `${target === 'node' ? 'server' : // eslint-disable-next-line unicorn/no-nested-ternary
      target === 'browser' ? 'es5' : 'modern-browsers'}.css`
    }), new OptimizeCssAssetsPlugin(), process.send && new webpack.ProgressPlugin((percentage, message) => {
      process.send({
        type: 'webpack-progress',
        percentage,
        message
      });
    }) // target === 'browser' &&
    // target !== 'node' &&
    //   production &&
    //   new optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //     },
    //     sourcleMap: !production,
    //   }),!== 'node' &&
    //   production &&
    //   new optimize.UglifyJsPlugin({
    //     compress: {
    //       warnings: false,
    //     },
    //     sourceMap: !production,
    //   }),
    // TODO https://github.com/NekR/offline-plugin
    ].filter(ExcludesFalsy)
  };
}

const createModernBrowserCompiler = production => createAppBrowserCompiler(MODERN, createPobpackConfig('modern-browser', production), {
  progressBar: false
});
const runDevServer = (compiler, port, proxyPort, options) => runDevServer$1(compiler, {
  port: proxyPort,
  https: false,
  contentBase: path.resolve('public'),
  watchContentBase: true,
  headers: {
    // avoid errors in console
    'Access-Control-Expose-Headers': 'SourceMap,X-SourceMap'
  },
  transportMode: 'ws',
  proxy: {
    '/ws': {
      target: `http://localhost:${port}`,
      ws: true
    },
    '**': {
      target: `http://localhost:${port}`
    }
  },
  ...options
});

const browserCompiler = createModernBrowserCompiler(false);
runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host
});
//# sourceMappingURL=watch-browser-node12-dev.mjs.map
