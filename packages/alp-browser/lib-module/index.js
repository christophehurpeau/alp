var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

/* global window */
import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

export { Config } from 'alp-config';

var logger = new Logger('alp');

var AlpBrowser = function (_Ibex) {
  function AlpBrowser() {
    var path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '/';

    var _ref = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        _ref$version = _ref.version,
        version = _ref$version === void 0 ? window.VERSION : _ref$version;

    _classCallCheck(this, AlpBrowser);

    var _this = _possibleConstructorReturn(this, (AlpBrowser.__proto__ || Object.getPrototypeOf(AlpBrowser)).call(this));

    return _this.appVersion = window.VERSION, _this.path = path, _this.appVersion = window.VERSION, _this;
  }

  return _inherits(AlpBrowser, _Ibex), _createClass(AlpBrowser, [{
    key: 'init',
    value: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          for (;;) switch (_context.prev = _context.next) {
            case 0:
              return _context.next = 2, config('/config')(this);

            case 2:
              return language(this), _context.next = 5, translate('/locales')(this);

            case 5:
            case 'end':
              return _context.stop();
          }
        }, _callee, this);
      }));

      return function init() {
        return _ref2.apply(this, arguments);
      };
    }()
  }, {
    key: 'start',
    value: function start(fn) {
      fn().then(function () {
        return logger.success('started');
      }).catch(function (err) {
        return logger.error('start fail', { err: err });
      });
    }
  }, {
    key: 'environment',
    get: function get() {
      return this.env;
    }
  }]), AlpBrowser;
}(Ibex);

export { AlpBrowser as default };
//# sourceMappingURL=index.js.map