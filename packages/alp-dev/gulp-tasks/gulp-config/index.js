const YML = require('js-yaml');
const util = require('util');
const PluginError = require('gulp-util').PluginError;
const replaceExtension = require('gulp-util').replaceExtension;
const through = require('through2');
const readFileSync = require('fs').readFileSync;
const pathDirname = require('path').dirname;
const pathResolve = require('path').resolve;

function loadConfigFile(content, opts, dirname) {
    var data = YML.safeLoad(content, opts);

    if (!data) {
        data = {};
    }

    var config = data.common || {};
    if (opts.dest === 'server') {
        Object.assign(config, data.server || {});
    } else if (opts.dest === 'browser') {
        Object.assign(config, data.browser || {});
    } else {
        throw new Error('gulp-config: unknown destination');
    }

    if (data.include) {
        const includePaths = data.include.map(includePath => pathResolve(dirname, includePath));
        includePaths
            .map(includePath => readFileSync(includePath))
            .map((content, index) => loadConfigFile(content, opts, pathDirname(includePaths[index])))
            .forEach(includeConfig => {
                Object.keys(includeConfig).forEach(key => {
                    if (!(key in config)) {
                        config[key] = includeConfig[key];
                        return;
                    }

                    if (Array.isArray(config[key])) {
                        config[key].push(contents[key]);
                    } else if (typeof config[key] === 'object') {
                        Object.assign(config[key], includeConfig[key]);
                    } else {
                        throw new PluginError(
                            'gulp-config',
                            'Unexpected override "' + key + '"',
                            { fileName: includePaths[index] }
                        );
                    }
                });
            });
    }

    return config;
}

module.exports = function(opts) {
    if (opts == null) {
        opts = {};
    }

    return through.obj(
        function(file, enc, cb) {
            if (file.isStream()) {
                return this.emit('error', new PluginError('gulp-config', 'Streams are not supported!'));
            } else if (file.isBuffer()) {
                try {
                    var content = file.contents.toString('utf8');
                    var config = loadConfigFile(content, opts, pathDirname(file.path));

                    file.path = replaceExtension(file.path, '.json');
                    file.contents = new Buffer(JSON.stringify(config, null, 4));
                    this.push(file);
                    return cb();
                } catch (error) {
                    this.emit(
                        'error',
                        error instanceof PluginError ? error :
                        new PluginError(
                            'gulp-config',
                            error,
                            { fileName: file.path }
                        )
                    );
                    return cb();
                }
            } else if (file.isNull()) {
                this.push(file);
                return cb();
            }
        }
    );
};
