'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.MigrationsManager = exports.newController = exports.Config = undefined;

var _alpConfig = require('alp-config');

Object.defineProperty(exports, 'Config', {
    enumerable: true,
    get: function get() {
        return _alpConfig.Config;
    }
});

var _alpController = require('alp-controller');

Object.defineProperty(exports, 'newController', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_alpController).default;
    }
});

var _alpMigrations = require('alp-migrations');

Object.defineProperty(exports, 'MigrationsManager', {
    enumerable: true,
    get: function get() {
        return _alpMigrations.MigrationsManager;
    }
});

var _util = require('util');

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _alpConfig2 = _interopRequireDefault(_alpConfig);

var _alpErrorsNode = require('alp-errors-node');

var _alpErrorsNode2 = _interopRequireDefault(_alpErrorsNode);

var _alpParamsNode = require('alp-params-node');

var _alpParamsNode2 = _interopRequireDefault(_alpParamsNode);

var _alpLanguage = require('alp-language');

var _alpLanguage2 = _interopRequireDefault(_alpLanguage);

var _alpTranslate = require('alp-translate');

var _alpTranslate2 = _interopRequireDefault(_alpTranslate);

var _alpLimosa = require('alp-limosa');

var _alpLimosa2 = _interopRequireDefault(_alpLimosa);

var _alpListen = require('alp-listen');

var _alpListen2 = _interopRequireDefault(_alpListen);

var _alpMigrations2 = _interopRequireDefault(_alpMigrations);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp');

class Alp extends _koa2.default {

    /**
     * @param {Object} [options]
     * @param {string} [options.srcDirname] directory of the application
     * @param {Config} [options.config] alp-config object
     * @param {string} [options.packageDirname] deprecated, directory of the package (where package.json is)
     * @param {Array} [options.argv] deprecated, list of overridable config by argv
     */
    constructor() {
        let options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        super();
        if (!options.packageDirname) options.packageDirname = process.cwd();
        if (!options.srcDirname) options.srcDirname = `${ options.packageDirname }/lib`;

        this.dirname = options.srcDirname;
        Object.defineProperty(this, 'packageDirname', {
            get: (0, _util.deprecate)(() => options.packageDirname, 'packageDirname'),
            configurable: false,
            enumerable: false
        });

        if (!options.config) {
            (0, _util.deprecate)(() => () => null, 'Alp options: missing options.config')();
            // eslint-disable-next-line
            const packageConfig = require(`${ options.packageDirname }/package.json`);
            (0, _alpConfig2.default)(`${ this.dirname }/config`, { packageConfig, argv: options.argv })(this);
        } else {
            (0, _alpConfig2.default)()(this, options.config);
        }

        (0, _alpParamsNode2.default)(this);
        (0, _alpLanguage2.default)(this);
        (0, _alpTranslate2.default)('locales')(this);

        this.use((0, _koaCompress2.default)());

        this.browserStateTransformers = [];
        this.context.computeInitialStateForBrowser = function () {
            const initialBrowserState = Object.create(null);
            this.app.browserStateTransformers.forEach(transformer => transformer(initialBrowserState, this));
            return initialBrowserState;
        };
    }

    registerBrowserStateTransformers(transformer) {
        this.browserStateTransformers.push(transformer);
    }

    migrate(migrationsManager) {
        return (0, _alpMigrations2.default)({
            config: this.config,
            dirname: this.dirname,
            migrationsManager
        });
    }

    get environment() {
        (0, _util.deprecate)(() => () => null, 'app.environment, use app.env instead')();
        return this.env;
    }

    get production() {
        (0, _util.deprecate)(() => () => null, 'app.production, use global.PRODUCTION instead')();
        return this.env === 'prod' || this.env === 'production';
    }

    createRouter(routerBuilder, controllers) {
        return (0, _alpLimosa2.default)(routerBuilder, controllers)(this);
    }

    servePublic() {
        this.use((0, _koaStatic2.default)(`${ this.packageDirname }/public/`)); // static files
    }

    catchErrors() {
        this.use(_alpErrorsNode2.default);
    }

    useRouter(routerBuilder, controllers) {
        // eslint-disable-next-line global-require
        routerBuilder = routerBuilder || require(`${ this.dirname }/routerBuilder`);
        // eslint-disable-next-line global-require
        controllers = controllers || require(`${ this.dirname }/controllers`);
        this.use(this.createRouter(routerBuilder, controllers));
    }

    listen() {
        return (0, _alpListen2.default)(`${ this.packageDirname }/config/cert`)(this).catch(err => {
            logger.error(err);
            throw err;
        });
    }
}
exports.default = Alp;
//# sourceMappingURL=index.js.map