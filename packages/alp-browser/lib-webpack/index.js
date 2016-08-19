var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import Ibex from 'ibex';
import config from 'alp-config';
import errors from 'alp-errors-browser';
import params from 'alp-params';
import language from 'alp-language';
import translate from 'alp-translate';
import router from 'alp-limosa';
import contentLoaded from 'content-loaded';
import { init as initWebApp, redirect } from 'alauda/web-app';

export { default as newController } from 'alp-controller';

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

    if (global.initialBrowserContext) {
      _this.context.state = global.initialBrowserContext.state;
    }
    return _this;
  }

  _createClass(AlpBrowser, [{
    key: 'init',
    value: function () {
      var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return config('/config')(this);

              case 2:
                params(this);
                language(this);
                _context.next = 6;
                return translate('/locales')(this);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function init() {
        return _ref.apply(this, arguments);
      }

      return init;
    }()
  }, {
    key: 'createRouter',
    value: function createRouter(routerBuilder, controllers) {
      return router(routerBuilder, controllers)(this);
    }
  }, {
    key: 'catchErrors',
    value: function catchErrors() {
      this.use(errors);
    }
  }, {
    key: 'useRouter',
    value: function useRouter(routerBuilder, controllers) {
      this.use(this.createRouter(routerBuilder, controllers));
    }
  }, {
    key: 'initialRender',
    value: function initialRender(moduleDescriptor, data) {
      var _this2 = this;

      var context = Object.create(this.context);
      Object.assign(context, global.initialBrowserContext);
      delete context.state;

      return contentLoaded().then(function () {
        return context.render(moduleDescriptor, data, true);
      }).then(function () {
        _this2.on('redirect', redirect);
        initWebApp(function (url) {
          return _this2.load(url);
        });
      });
    }
  }, {
    key: 'environment',
    get: function get() {
      return this.env;
    }
  }]);

  return AlpBrowser;
}(Ibex);

export default AlpBrowser;
//# sourceMappingURL=index.js.map