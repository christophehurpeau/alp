'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = exports.newController = undefined;

var _alpController = require('alp-controller');

Object.defineProperty(exports, 'newController', {
    enumerable: true,
    get: /**
          * @function
         */function get() {
        return _interopRequireDefault(_alpController).default;
    }
});

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaCompress = require('koa-compress');

var _koaCompress2 = _interopRequireDefault(_koaCompress);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _alpConfig = require('alp-config');

var _alpConfig2 = _interopRequireDefault(_alpConfig);

var _alpErrorsNode = require('alp-errors-node');

var _alpErrorsNode2 = _interopRequireDefault(_alpErrorsNode);

var _alpParamsNode = require('alp-params-node');

var _alpParamsNode2 = _interopRequireDefault(_alpParamsNode);

var _alpLanguage = require('alp-language');

var _alpLanguage2 = _interopRequireDefault(_alpLanguage);

var _alpLogger = require('alp-logger');

var _alpLogger2 = _interopRequireDefault(_alpLogger);

var _alpTranslate = require('alp-translate');

var _alpTranslate2 = _interopRequireDefault(_alpTranslate);

var _alpLimosa = require('alp-limosa');

var _alpLimosa2 = _interopRequireDefault(_alpLimosa);

var _alpListen = require('alp-listen');

var _alpListen2 = _interopRequireDefault(_alpListen);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Alp = class Alp extends _koa2.default {
    /**
     * @param {string} [packageDirname] directory of the package (where package.json is)
     * @param {string} [srcDirname] directory of the application
     * @param {Object} [options]
     * @param {array} [options.argv] list of overridable config by argv
    */
    constructor() {
        let packageDirname = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];
        let srcDirname = arguments.length <= 1 || arguments[1] === undefined ? `${ packageDirname }/lib` : arguments[1];
        let options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

        super();
        this.packageDirname = packageDirname;
        this.dirname = srcDirname;
        const packageConfig = require(`${ packageDirname }/package.json`);
        (0, _alpConfig2.default)(`${ this.dirname }/config`, {
            packageConfig: packageConfig,
            argv: options.argv
        })(this);
        (0, _alpParamsNode2.default)(this);
        (0, _alpLanguage2.default)(this);
        (0, _alpLogger2.default)(this);
        (0, _alpTranslate2.default)('locales')(this);
        this.use((0, _koaCompress2.default)());
    }

    /**
     * @member environment
    */get environment() {
        return this.env;
    }

    /**
     * @member production
    */get production() {
        return this.env === 'prod' || this.env === 'production';
    }

    /**
     * @param routerBuilder
     * @param controllers
    */createRouter(routerBuilder, controllers) {
        return (0, _alpLimosa2.default)(routerBuilder, controllers)(this);
    }

    servePublic() {
        this.use((0, _koaStatic2.default)(`${ this.packageDirname }/public/`)); // static files
    }

    catchErrors() {
        this.use(_alpErrorsNode2.default);
    }

    /**
     * @param routerBuilder
     * @param controllers
    */useRouter(routerBuilder, controllers) {
        routerBuilder = routerBuilder || require(`${ this.dirname }/routerBuilder`);
        controllers = controllers || require(`${ this.dirname }/controllers`);
        this.use(this.createRouter(routerBuilder, controllers));
    }

    listen() {
        return (0, _alpListen2.default)(`${ this.packageDirname }/config/cert`)(this).catch(err => {
            this.logger.error(err);
            throw err;
        });
    }
};
exports.default = Alp;
//# sourceMappingURL=index.js.map