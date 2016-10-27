// https://gist.github.com/demisx/beef93591edc1521330a

var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var ymlConfig = require('./gulp-config');

var port, browserSyncPort;

var argv = require('minimist')(process.argv.slice(2), {
    alias: {
        production: 'prod',
    },
});

/* PORT */

gulp.task('define-port', function(done) {
    if (port || argv['socket-folder']) {
        return done();
    }

    var portscanner = require('portscanner');
    port = argv.startPort || 3050;
    portscanner.findAPortNotInUse(port, port + 50, '127.0.0.1', function(error, foundPort) {
        port = foundPort;
        done();
    });
});
gulp.task('define-browser-sync-port', function(done) {
    if (browserSyncPort) {
        return done();
    }

    var portscanner = require('portscanner');
    browserSyncPort = argv.browserSyncStartPort || 3000;
    portscanner.findAPortNotInUse(browserSyncPort, browserSyncPort + 50, '127.0.0.1', function(err, foundPort) {
        browserSyncPort = foundPort;
        done();
    });
});

/* CONFIG */

function buildConfigBrowser() {
    return gulp.src('src/config/**/*.yml')
        .pipe(ymlConfig({ dest: 'browser' }))
        .pipe(gulp.dest('public/config'));
}

/* FRONT */

function buildStylus() {
    return gulp.src(['styles/*.styl', '!styles/_*'])
        .pipe(stylus({
            'include css': true,
            paths: ['node_modules'],
        }))
        .pipe(gulp.dest('public/'));
}

gulp.task(
    'build',
    gulp.parallel(
        buildStylus,
        buildConfigBrowser
    )
);

function watchThenBuild() {
    gulp.watch('src/config/**/*.yml', buildConfigBrowser);
    gulp.watch('styles/**/*.styl', buildStylus);
}

gulp.task(watchThenBuild);

gulp.task('watch', gulp.parallel('watchThenBuild'));

var webpackAndBrowserSyncDaemon;
process.on('exit', function(code) {
    if (webpackAndBrowserSyncDaemon) {
        webpackAndBrowserSyncDaemon.stop();
    }
});

gulp.task(
    'webpack+browsersync',
    gulp.series(
        gulp.parallel('define-port', 'define-browser-sync-port'),
        function(cb) {
            webpackAndBrowserSyncDaemon = webpackAndBrowserSyncDaemon || require('springbokjs-daemon').node([
                '--harmony',
                '--es_staging',
                require.resolve('../dev'),
                '--port',
                browserSyncPort,
                '--proxyPort',
                port,
            ]);
            webpackAndBrowserSyncDaemon.start();
            cb();
        }
    )
);

gulp.task('default', gulp.series('build', 'webpack+browsersync', 'watch'));
