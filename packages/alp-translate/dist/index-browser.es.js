import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _regeneratorRuntime from '@babel/runtime/regenerator';
import IntlMessageFormatDefault from 'intl-messageformat';

var IntlMessageFormat = // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
IntlMessageFormatDefault["default"] || IntlMessageFormatDefault;
function load(translations, language) {
  var result = new Map();

  (function loadMap(map, prefix) {
    map.forEach(function (value, key) {
      if (typeof value === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        loadMap(value, "" + prefix + key + ".");
        return;
      } // eslint-disable-next-line @typescript-eslint/no-unsafe-argument


      result.set("" + prefix + key, new IntlMessageFormat(value, language));
    });
  })(translations, '');

  return result;
}

function alpTranslate(dirname) {
  dirname = dirname.replace(/\/*$/, '/');
  return /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(app) {
      var language, map, translations;
      return _regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              language = app.context.language;
              _context.next = 3;
              return app.loadConfig(dirname + language);

            case 3:
              map = _context.sent;
              translations = load(map, language);
              Object.assign(app.context, {
                t: function t(key, args) {
                  var msg = translations.get(key);
                  if (!msg) return key;
                  return msg.format(args);
                }
              });

            case 6:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }));

    return function () {
      return _ref.apply(this, arguments);
    };
  }();
}

export { alpTranslate as default };
//# sourceMappingURL=index-browser.es.js.map
