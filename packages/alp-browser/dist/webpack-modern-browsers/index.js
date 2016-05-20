'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.newController = undefined;

var _alpController = require('alp-controller');

Object.defineProperty(exports, 'newController', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_alpController).default;
    }
});

var _ibex = require('ibex');

var _ibex2 = _interopRequireDefault(_ibex);

var _alpConfig = require('alp-config');

var _alpConfig2 = _interopRequireDefault(_alpConfig);

var _alpLanguage = require('alp-language');

var _alpLanguage2 = _interopRequireDefault(_alpLanguage);

var _alpTranslate = require('alp-translate');

var _alpTranslate2 = _interopRequireDefault(_alpTranslate);

var _alpLimosa = require('alp-limosa');

var _alpLimosa2 = _interopRequireDefault(_alpLimosa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }
// import errors from 'alp-errors-browser';
// import params from 'alp-params-browser';


class AlpBrowser extends _ibex2.default {

    /**
     * @param {string} [path='/']
     * @param {Object} [options]
     */
    constructor() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        super();
        this.path = path;
    }

    init() {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield (0, _alpConfig2.default)('config')(_this);
            (0, _alpLanguage2.default)(_this);
            yield (0, _alpTranslate2.default)('locales')(_this);
        })();
    }

    get environment() {
        return this.env;
    }

    createRouter(routerBuilder, controllers) {
        return (0, _alpLimosa2.default)(routerBuilder, controllers)(this);
    }

    catchErrors() {
        // this.use(errors);
    }

    useRouter(routerBuilder, controllers) {
        this.use(this.createRouter(routerBuilder, controllers));
    }
}
exports.default = AlpBrowser;
//# sourceMappingURL=index.js.map