const util = require('util');
const { PluginError, replaceExtension } = require('gulp-util');
const through = require('through2');
const { dirname: pathDirname } = require('path');
const loadConfigFile = require('../../lib-node6/utils/loadConfigFile');

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
                    var config = loadConfigFile(content, opts.dest, pathDirname(file.path));

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
