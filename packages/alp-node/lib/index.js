'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _koa = require('koa');

var _koa2 = _interopRequireDefault(_koa);

var _koaStatic = require('koa-static');

var _koaStatic2 = _interopRequireDefault(_koaStatic);

var _koaConvert = require('koa-convert');

var _koaConvert2 = _interopRequireDefault(_koaConvert);

var _aukConfig = require('auk-config');

var _aukConfig2 = _interopRequireDefault(_aukConfig);

var _aukErrors = require('auk-errors');

var _aukErrors2 = _interopRequireDefault(_aukErrors);

var _aukParams = require('auk-params');

var _aukParams2 = _interopRequireDefault(_aukParams);

var _aukLanguage = require('auk-language');

var _aukLanguage2 = _interopRequireDefault(_aukLanguage);

var _aukLogger = require('auk-logger');

var _aukLogger2 = _interopRequireDefault(_aukLogger);

var _aukTranslate = require('auk-translate');

var _aukTranslate2 = _interopRequireDefault(_aukTranslate);

var _aukLimosa = require('auk-limosa');

var _aukLimosa2 = _interopRequireDefault(_aukLimosa);

var _aukListen = require('auk-listen');

var _aukListen2 = _interopRequireDefault(_aukListen);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let Auk = class Auk extends _koa2.default {
    /**
     * @param {string} [dirname] directory of the application (lib/) or `process.cwd()`
     * @param {Object} [options] directory of the application (lib/) or `process.cwd()`
     * @param {array} [options.argv] list of overridable config by argv
    */
    constructor() {
        let dirname = arguments.length <= 0 || arguments[0] === undefined ? process.cwd() : arguments[0];
        let options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        super();
        this.dirname = dirname;
        const packageConfig = require(`${ dirname }/../package.json`);
        (0, _aukConfig2.default)(`${ this.dirname }/config`, {
            packageConfig,
            argv: options.argv
        })(this);
        (0, _aukParams2.default)(this);
        (0, _aukLanguage2.default)(this);
        (0, _aukLogger2.default)(this);
        (0, _aukTranslate2.default)('locales')(this);
    }

    /**
     * @member environment
    */get environment() {
        return this.env;
    }

    /**
     * @param routerBuilder
     * @param controllers
    */createRouter(routerBuilder, controllers) {
        return (0, _aukLimosa2.default)(routerBuilder, controllers)(this);
    }

    servePublic() {
        this.use((0, _koaConvert2.default)((0, _koaStatic2.default)(`${ this.dirname }/../public/`))); // static files
    }

    catchErrors() {
        this.use(_aukErrors2.default);
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
        return (0, _aukListen2.default)(`${ this.dirname }/../config/cert`)(this).catch(err => {
            this.logger.error(err);
            throw err;
        });
    }
};
exports.default = Auk;
//# sourceMappingURL=index.js.map