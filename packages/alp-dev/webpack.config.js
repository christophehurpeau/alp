const path = require('path');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production';

console.log(path.resolve('public'));

module.exports = {
    debug: !production,

    entry: './src/index.browser.js',
    output: {
        path: path.resolve('public'),
        publicPath: '/',
        filename: 'bundle.js',
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

        loaders: [
            {
                test: /\.jsx?$/,
                // exclude: /(node_modules)/,
                loader: 'babel',
                include: path.resolve('src'),
                query: {
                    presets: (
                        !production ? ['modern-browsers', 'react', 'modern-browsers/stage1']//, 'react-hmre']
                                    : ['es2015', 'react', 'stage-1']
                    ),
                    plugins: ['transform-decorators-legacy'],
                },
            },
        ],
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
    },
    resolve: {
        alias: { 'socket.io': 'socket.io-client' },
        modules: ['browser/node_modules'],
        extensions: ['', '.browser.js', '.js', '.browser.jsx', '.jsx', '.json'],
        packageMains: ['webpack', 'browser', 'main'],
        packageAlias: ['webpack', 'browser'],
    },

    node: { util: 'empty' }, // fix nightingale...
    plugins: [
        new webpack.DefinePlugin({
            BROWSER: true,
            NODE: false,
            PRODUCTION: production,
        }),
        ...(production ? [] : [new webpack.HotModuleReplacementPlugin()]),
    ],
};
