/**
 * https://github.com/BrowserSync/recipes/blob/master/recipes/webpack.react-hot-loader/app.js
 * Require Browsersync along with webpack and middleware for it
 */
const argv = require('minimist-argv');
const browserSync = require('browser-sync');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

/**
 * Require ./webpack.config.js and make a bundler from it
 */
const webpackConfig = require('../webpack.config');

const bundler = webpack(webpackConfig);

const port = argv.port || 3000;

/**
 * Run Browsersync and use middleware for Hot Module Replacement
 */
export default browserSync({
  open: argv.open,
  port: port,
  ui: { port: port + 1 },

  ghostMode: {
    clicks: false,
    forms: false,
    scroll: true,
  },

  proxy: {
    target: `localhost:${argv.proxyPort}`,
    proxyOptions: { xfwd: true },
    middleware: [
      // headers
      function (req, res, next) {
        if (!req.headers['X-Forwarded-Host']) {
          req.headers['X-Forwarded-Host'] = req.headers.host;
        }
        next();
      },

      webpackDevMiddleware(bundler, {
        // IMPORTANT: dev middleware can't access config, so we should
        // provide publicPath by ourselves
        publicPath: webpackConfig.output.publicPath,

        // pretty colored output
        stats: { colors: true },

        noInfo: true,
        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler),
    ],
  },

  serveStatic: ['public'],

    // no need to watch '*.js' here, webpack will take care of it for us,
    // including full page reloads if HMR won't work
  files: [
    'public/**/*.css',
  ],
});
