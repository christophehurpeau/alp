module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'jspm', 'fixture'],

        browsers: [
            'Firefox',
            'Chrome',
            // 'PhantomJS',
        ],

        files: [
            'https://cdn.polyfill.io/v2/polyfill.min.js?features=all',
            'public/jspm_packages/system.js',
            'public/config.js',
            'mocha.conf.js',
            'test/browser/fixtures/**/*',
            'public/index.bundle.js',
            'dist/test.js',
        ],

        jspm: {
            paths: {
                '*': 'public/js/*.js',
            },
            useBundles: true,
        },

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
        reporters: ['progress'],

        preprocessors: {
          '**/*.html': ['html2js'],
        },


        // enable / disable colors in the output (reporters and logs)
        colors: !process.env.DRONE,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR
        //  || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,
    });
};
