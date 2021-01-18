'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _regeneratorRuntime = require('../../../node_modules/@babel/runtime/regenerator/index.js');
var _asyncToGenerator = require('../../../node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js');
var IntlMessageFormat = require('intl-messageformat');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

var _regeneratorRuntime__default = /*#__PURE__*/_interopDefaultLegacy(_regeneratorRuntime);
var _asyncToGenerator__default = /*#__PURE__*/_interopDefaultLegacy(_asyncToGenerator);
var IntlMessageFormat__default = /*#__PURE__*/_interopDefaultLegacy(IntlMessageFormat);

function load(translations, language) {
  const result = new Map();

  (function loadMap(map, prefix) {
    map.forEach((value, key) => {
      if (typeof value === 'object') {
        return loadMap(value, `${prefix}${key}.`);
      }

      result.set(`${prefix}${key}`, new IntlMessageFormat__default(value, language));
    });
  })(translations, '');

  return result;
}

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator__default( /*#__PURE__*/_regeneratorRuntime__default.mark(function _callee(app) {
      var language, map, translations, msg;
      return _regeneratorRuntime__default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            language = app.context.language;
            _context.next = 3;
            return app.loadConfig(dirname + language);

          case 3:
            map = _context.sent;
            translations = load(map, language);
            _context.t0 = Object;
            _context.t1 = app.context;
            _context.t2 = {
              t(key, args) {
                msg = translations.get(key);
                if (!msg) return key;
                return msg.format(args);
              }

            };

            _context.t0.assign.call(_context.t0, _context.t1, _context.t2);

          case 9:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();
}

exports.default = alpTranslate;
//# sourceMappingURL=index-browser.cjs.js.map
