'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ibex = require('ibex');

var _ibex2 = _interopRequireDefault(_ibex);

var _alpConfig = require('alp-config');

var _alpConfig2 = _interopRequireDefault(_alpConfig);

var _alpErrorsBrowser = require('alp-errors-browser');

var _alpErrorsBrowser2 = _interopRequireDefault(_alpErrorsBrowser);

var _alpLanguage = require('alp-language');

var _alpLanguage2 = _interopRequireDefault(_alpLanguage);

var _alpLogger = require('alp-logger');

var _alpLogger2 = _interopRequireDefault(_alpLogger);

var _alpTranslate = require('alp-translate');

var _alpTranslate2 = _interopRequireDefault(_alpTranslate);

var _alpLimosa = require('alp-limosa');

var _alpLimosa2 = _interopRequireDefault(_alpLimosa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
// import params from 'alp-params-browser';


var AlpBrowser = function (_Ibex) {
    _inherits(AlpBrowser, _Ibex);

    /**
     * @param {string} [path='/']
     * @param {Object} [options]
     */

    function AlpBrowser() {
        var path = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, AlpBrowser);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AlpBrowser).call(this));

        _this.path = path;
        return _this;
    }

    _createClass(AlpBrowser, [{
        key: 'init',
        value: function () {
            var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return (0, _alpConfig2.default)('config')(this);

                            case 2:
                                (0, _alpLogger2.default)(this);
                                (0, _alpLanguage2.default)(this);
                                _context.next = 6;
                                return (0, _alpTranslate2.default)('locales')(this);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            return function init() {
                return ref.apply(this, arguments);
            };
        }()
    }, {
        key: 'createRouter',
        value: function createRouter(routerBuilder, controllers) {
            return (0, _alpLimosa2.default)(routerBuilder, controllers)(this);
        }
    }, {
        key: 'catchErrors',
        value: function catchErrors() {
            this.use(_alpErrorsBrowser2.default);
        }
    }, {
        key: 'useRouter',
        value: function useRouter(routerBuilder, controllers) {
            this.use(this.createRouter(routerBuilder, controllers));
        }
    }, {
        key: 'environment',
        get: function get() {
            return this.env;
        }
    }]);

    return AlpBrowser;
}(_ibex2.default);

exports.default = AlpBrowser;
//# sourceMappingURL=index.js.map