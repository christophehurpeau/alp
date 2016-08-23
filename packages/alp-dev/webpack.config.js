const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');
const createBabelOpts = require('pob-babel/lib/babel-options');

const production = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const dest = process.env.WEBPACK_DEST || 'modern-browsers';
const modernBrowsers = dest === 'modern-browsers';
// const modernBrowsers = false;

const babelOptions = createBabelOpts(
    `webpack${modernBrowsers ? '-modern-browsers' : ''}${!production ? '-dev' : ''}`,
    true
);

const modulesList = (() => {
    try {
        return fs.readdirSync(path.resolve('src/modules'));
    } catch (e) {
        return [];
    }
})();

module.exports = {
    debug: !production,
    devtool: production ? undefined : 'cheap-source-map',
    bail: true,

    entry: {
        [dest]: [
            !modernBrowsers && 'babel-regenerator-runtime',
            !production && 'webpack-hot-middleware/client',
            !production && 'react-hot-loader/patch',
            './src/index.browser.js',
        ].filter(Boolean),
    },
    output: {
        path: path.resolve('public'),
        publicPath: '/',
        filename: '[name].js',
        pathinfo: !production,
    },
    module: {
        // Disable handling of unknown requires
        unknownContextRegExp: /$^/,
        unknownContextCritical: false,

        // Disable handling of requires with a single expression
        exprContextRegExp: /$^/,
        exprContextCritical: false,

        // Disable handling of expression in require
        wrappedContextRegExp: /$^/,
        wrappedContextCritical: false,
        wrappedContextRecursive: false,


        preLoaders: [
            // { test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/ },
            // { test: /\.jsx?$/, loader: 'source-map', exclude: /react-hot-loader/ }
        ],

        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /\.server\.jsx?$/,
                loader: 'babel',
                include: path.resolve('src'),
                query: {
                    compact: production,
                    minified: production,
                    comments: !production,
                    presets: babelOptions.presets,
                    plugins: babelOptions.plugins,
                },
            },
        ],
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
    },
    resolve: {
        alias: { 'socket.io': 'socket.io-client' },
        modules: ['node_modules'],
        extensions: ['', '.browser.js', '.js', '.browser.jsx', '.jsx', '.json'],
        mainFields: [
            modernBrowsers && !production && 'webpack:main-modern-browsers-dev',
            modernBrowsers && 'webpack:main-modern-browsers',
            !production && 'webpack:main-dev',
            'webpack:main',
            !production && 'browser-dev',
            'browser',
            !production && 'main-dev',
            'webpack',
            'main',
        ].filter(Boolean),
        aliasFields: [
            modernBrowsers && !production && 'webpack:aliases-modern-browsers-dev',
            modernBrowsers && 'webpack:aliases-modern-browsers',
            !production && 'webpack:aliases-dev',
            'webpack:aliases',
            'webpack',
            'browser',
        ],
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: dest,
            filename: `${dest}.js`,
            chunks: [dest],
            // minChunks: modulesList.length === 1 ? 1 : 2,
        }),
        new webpack.LoaderOptionsPlugin({
            debug: !production,
            minimize: production,
        }),
        new webpack.DefinePlugin({
            BROWSER: true,
            SERVER: false,
            NODEJS: false,
            PRODUCTION: production,
            MODERN_BROWSERS: modernBrowsers,
            'process.env': {
                NODE_ENV: JSON.stringify(production ? 'production' : process.env.NODE_ENV),
            },
        }),
        !production && new webpack.HotModuleReplacementPlugin(),
        !production && new webpack.NoErrorsPlugin(),
        production && new webpack.optimize.UglifyJsPlugin({
            mangle: false,
            compress: {
                warnings: false,
            },
            sourceMap: !production,
        }),

        // TODO https://github.com/NekR/offline-plugin
    ].filter(Boolean),
};
