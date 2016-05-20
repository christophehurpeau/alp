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

        if (!(typeof this.path === 'string')) {
            throw new TypeError('Value of "this.path" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(this.path));
        }
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

function _inspect(input, depth) {
    var maxDepth = 4;
    var maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=index.js.map