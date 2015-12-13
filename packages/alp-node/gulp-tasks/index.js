// https://gist.github.com/demisx/beef93591edc1521330a

var sourcemaps = require('gulp-sourcemaps');
var babel = require('gulp-babel');
var clip = require('gulp-clip-empty-files');
var jspm = require('gulp-jspm');
var rename = require('gulp-rename');
var stylus = require('gulp-stylus');
var grep = require('gulp-grep');
var ymlConfig = require('./gulp-config');
var browserSync = require('browser-sync');
var bs;

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
    port = argv.startPort || 3000;
    portscanner.findAPortNotInUse(port, port + 50, '127.0.0.1', function(error, port) {
        port = port;
        done();
    });
});
gulp.task('define-browser-sync-port', function(done) {
    if (browserSyncPort) {
        return done();
    }

    var portscanner = require('portscanner');
    browserSyncPort = argv.browserSyncStartPort || 3100;
    portscanner.findAPortNotInUse(browserSyncPort, browserSyncPort + 50, '127.0.0.1', function(err, port) {
        browserSyncPort = port;
        done();
    });
});

/* CONFIG */
function buildConfigServer() {
    return gulp.src('src/config/**/*.yml')
        .pipe(ymlConfig({ dest: 'server' }))
        .pipe(gulp.dest('lib/config'));
}

function buildConfigBrowser() {
    return gulp.src('src/config/**/*.yml')
        .pipe(ymlConfig({ dest: 'browser' }))
        .pipe(gulp.dest('public/js/config'));
}

/* FRONT */

function buildStylus() {
    if (bs) {
        bs.notify('Compiling, please wait!');
    }

    var stream = gulp.src('styles/*.styl')
        .pipe(sourcemaps.init())
        .pipe(stylus({
            paths: ['node_modules'],
        }))
        .pipe(sourcemaps.write('.', { sourceRoot: '/' }))
        .pipe(gulp.dest('public/'))
        .pipe(grep('**/*.css', { read: false, dot: true }));
    if (bs) {
        stream.pipe(bs.stream());
    }

    return stream;
}

function buildJsServer() {
    if (bs) {
        bs.notify('Compiling, please wait!');
    }

    var stream = gulp.src(
            ['src/**/*.{js,jsx}', '!src/**/*.browser.{js,jsx}', '!src/browser/**/*.{js,jsx}'],
            { since: gulp.lastRun(buildJsServer) }
        )
        .pipe(rename(function(path) {
            if (path.basename.endsWith('.server')) {
                path.basename = path.basename.slice(0, -'.server'.length);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(clip())
        .pipe(babel({
            presets: ['es2015-node5', 'react', 'stage-0'],
            plugins: ['transform-decorators-legacy'],
        }))
        .pipe(sourcemaps.write('.', { sourceRoot: '/' }))
        .pipe(gulp.dest('lib'));

    if (bs) {
        stream.pipe(bs.stream());
    }

    return stream;
}

function buildJsBrowser() {
    if (bs) {
        bs.notify('Compiling, please wait!');
    }

    var stream = gulp.src(
            ['src/**/*.{js,jsx}', '!src/**/*.server.{js,jsx}', '!src/server/**/*.{js,jsx}'],
            { since: gulp.lastRun(buildJsBrowser) }
        )
        .pipe(rename(function(path) {
            if (path.basename.endsWith('.browser')) {
                path.basename = path.basename.slice(0, -'.browser'.length);
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['es2015', 'react', 'stage-0'],
            plugins: ['transform-decorators-legacy'],
        }))
        .pipe(sourcemaps.write('.', { sourceRoot: '/' }))
        .pipe(gulp.dest('public/js/'));
    /*if (bs) {
        stream.pipe(bs.stream());
    }*/

    return stream;
}

function buildJsBundle() {
    var stream = gulp.src('public/js/index.js')
        .pipe(sourcemaps.init())
        .pipe(jspm({ selfExecutingBundle: false }))
        // .pipe(rename('index.js'))
        .pipe(sourcemaps.write('.', { sourceRoot: '/' }))
        .pipe(gulp.dest('public'));

    if (bs) {
        stream.pipe(bs.stream());
    }

    return stream;
}

gulp.task(
    'build',
    gulp.parallel(
        buildStylus,
        buildConfigServer,
        buildConfigBrowser,
        buildJsServer,
        gulp.series(buildJsBrowser, buildJsBundle)
    )
);

function watchThenBuild() {
    gulp.watch('src/config/*.yml', gulp.parallel(buildConfigServer, buildConfigBrowser));
    gulp.watch('styles/**/*.styl', buildStylus);
    gulp.watch('src/**/*.{js,jsx}', gulp.parallel(buildJsServer, gulp.series(buildJsBrowser, buildJsBundle)));
}

gulp.task(watchThenBuild);

var daemon;
process.on('exit', function(code) {
    if (daemon) {
        daemon.stop();
    }
});

gulp.task(
    'runandwatch:server',
    gulp.series(
        'define-port',
        function runAndWatchApp() {
            daemon = daemon || require('springbokjs-daemon').node([
                '--harmony',
                '--es_staging',
                'lib/index.js',
                '--port',
                port,
            ]);
            daemon.start();
            gulp.watch(['lib/**/*.{js,jsx}', '../lib/**/*.js']).on('change', function() {
                daemon.restart();
                if (bs) {
                    setTimeout(function() {
                        bs.reload();
                    }, 1000);
                }
            });
        }
    )
);

gulp.task('watch', gulp.parallel('watchThenBuild', 'runandwatch:server'));

gulp.task(
    'ws',
    gulp.series(
        gulp.parallel('define-port', 'define-browser-sync-port'),
        function(cb) {
            bs = browserSync.create();
            bs.init({
                proxy: 'localhost:' + port,
                port: browserSyncPort,
                notify: true,
                open: false,
            }, cb);
        }
    )
);

gulp.task('default', gulp.series('build', 'ws', 'watch'));
