var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false, descriptor.configurable = true, "value" in descriptor && (descriptor.writable = true), Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), Constructor; }; }();

var _dec, _dec2, _desc, _value, _class, _descriptor, _descriptor2;

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { return void reject(error); } return info.done ? void resolve(value) : Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } return step("next"); }); }; }

function _initDefineProp(target, property, descriptor, context) {
  descriptor && Object.defineProperty(target, property, {
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
    writable: descriptor.writable,
    value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
  });
}

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function"); }

function _possibleConstructorReturn(self, call) { if (!self) throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }), superClass && (Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass); }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  return Object['keys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  }), desc.enumerable = !!desc.enumerable, desc.configurable = !!desc.configurable, ('value' in desc || desc.initializer) && (desc.writable = true), desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc), context && desc.initializer !== void 0 && (desc.value = desc.initializer ? desc.initializer.call(context) : void 0, desc.initializer = void 0), desc.initializer === void 0 && (Object['defineProperty'](target, property, desc), desc = null), desc;
}

function _initializerWarningHelper() {
  throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
}

/* global window */
import Ibex from 'ibex';
import config from 'alp-config';
import language from 'alp-language';
import translate from 'alp-translate';
import Logger from 'nightingale-logger';

import t from 'flow-runtime';
export { Config } from 'alp-config';

var logger = new Logger('alp');

var OptionsType = t.type('OptionsType', t.object(t.property('version', t.nullable(t.string()))));
var AlpBrowser = (_dec = t.decorate(t.string()), _dec2 = t.decorate(t.string()), _class = function (_Ibex) {
  function AlpBrowser() {
    var path = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : '/';

    var _arg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};

    _classCallCheck(this, AlpBrowser);

    var _OptionsType$assert = OptionsType.assert(_arg),
        _OptionsType$assert$v = _OptionsType$assert.version,
        version = _OptionsType$assert$v === void 0 ? window.VERSION : _OptionsType$assert$v;

    var _this = _possibleConstructorReturn(this, (AlpBrowser.__proto__ || Object.getPrototypeOf(AlpBrowser)).call(this));

    return _this.appVersion = window.VERSION, _initDefineProp(_this, 'path', _descriptor, _this), _initDefineProp(_this, 'appVersion', _descriptor2, _this), _this.path = path, _this.appVersion = window.VERSION, _this;
  }

  return _inherits(AlpBrowser, _Ibex), _createClass(AlpBrowser, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
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
        return _ref.apply(this, arguments);
      };
    }()
  }, {
    key: 'start',
    value: function start(fn) {
      var _fnType = t.function();

      t.param('fn', _fnType).assert(fn), fn().then(function () {
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
}(Ibex), _descriptor = _applyDecoratedDescriptor(_class.prototype, 'path', [_dec], {
  enumerable: true,
  initializer: null
}), _descriptor2 = _applyDecoratedDescriptor(_class.prototype, 'appVersion', [_dec2], {
  enumerable: true,
  initializer: null
}), _class);
export { AlpBrowser as default };
//# sourceMappingURL=index.js.map