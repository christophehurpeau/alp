const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const OfflinePlugin = require('offline-plugin');

const production = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';
const dest = process.env.WEBPACK_DEST || 'modern-browsers';

const modulesList = (() => {
    try {
        return fs.readdirSync(path.resolve('src/modules'));
    } catch (e) {
        return [];
    }
})();

module.exports = {
    debug: !production,
    devtool: production ? undefined : 'inline-source-map',

    entry: { [dest]: './src/index.browser.js' },
    output: {
        path: path.resolve('public'),
        publicPath: '/',
        filename: '[name].js',
        pathinfo: !production,
    },
    module: {
        // Disable handling of unknown requires
        unknownContextRegExp: /$^/,
        unknownContextCritical: true,

        // Disable handling of requires with a single expression
        exprContextRegExp: /$^/,
        exprContextCritical: true,

        // Disable handling of expression in require
        wrappedContextRegExp: /$^/,
        wrappedContextCritical: true,
        wrappedContextRecursive: false,


        preLoaders: [
            // {test: /\.jsx?$/, loader: 'eslint', exclude: /node_modules/},
            {test: /\.jsx?$/, loader: 'source-map', exclude: /react-hot-loader/}
        ],

        loaders: [
            {
                test: /\.jsx?$/,
                // exclude: /(node_modules)/,
                loader: 'babel',
                include: path.resolve('src'),
                query: {
                    presets: (
                        dest === 'modern-browsers' ?
                            ['modern-browsers', 'react', 'modern-browsers/stage1']//, 'react-hmre']
                            : ['es2015', 'react', 'stage-1']
                    ),
                    plugins: (!production ? ['typecheck'] : [])
                        .concat(['transform-decorators-legacy']),
                },
            },
        ],
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
    },
    resolve: {
        alias: { 'socket.io': 'socket.io-client' },
        modules: ['browser/node_modules', 'node_modules'],
        extensions: ['', '.browser.js', '.js', '.browser.jsx', '.jsx', '.json'],
        packageMains: ['webpack', 'browser', 'main'],
        packageAlias: ['webpack', 'browser'],
    },

    node: { util: 'empty' }, // fix nightingale...
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'bundle',
            filename: 'bundle.js',
            chunks: ['bundle'],
            // minChunks: modulesList.length === 1 ? 1 : 2,
        }),
        new webpack.LoaderOptionsPlugin({
            debug: !production,
            minimize: !production,
        }),
        new webpack.DefinePlugin({
            BROWSER: true,
            SERVER: false,
            NODE: false,
            PRODUCTION: production,
        }),
        ...(production ? [
            new webpack.optimize.UglifyJsPlugin({
                mangle: false,
                compress: {
                    warnings: false,
                    'drop_debugger': !!production,
                    unused: false,
                    comparisons: true,
                    sequences: false
                },
                output: {
                    beautify: !production && {
                        'max-line-len': 200,
                        bracketize: true,
                    },
                    comments: !production && 'all',
                },
                sourceMap: !production
            })
        ] : [
            // new webpack.HotModuleReplacementPlugin()
        ]),

        // TODO https://github.com/NekR/offline-plugin
    ],
};
