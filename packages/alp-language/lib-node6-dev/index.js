'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpLanguage;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _objectProperties = require('object-properties');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function alpLanguage(app) {
  const config = app.context.config;
  const availableLanguages = _assert(config.get('availableLanguages'), _tcombForked2.default.list(_tcombForked2.default.String), 'availableLanguages');
  if (!availableLanguages) {
    throw new Error('Missing config "availableLanguages"');
  }

  (0, _objectProperties.defineLazyProperty)(app.context, 'language', function () {
    return this.acceptsLanguages(availableLanguages);
  });

  (0, _objectProperties.defineLazyProperty)(app.context, 'firstAcceptedLanguage', function () {
    return this.acceptsLanguages()[0] || availableLanguages[0];
  });
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map