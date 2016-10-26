'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _alouette = require('alouette');

var _HtmlRenderer = require('alouette/HtmlRenderer');

var _HtmlRenderer2 = _interopRequireDefault(_HtmlRenderer);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const logger = new _nightingaleLogger2.default('alp.errors');
const errorHtmlRenderer = new _HtmlRenderer2.default();

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      // eslint-disable-next-line no-ex-assign
      if (!err) err = new Error('Unknown error');
      // eslint-disable-next-line no-ex-assign
      if (typeof err === 'string') err = new Error(err);

      ctx.status = err.status || 500;
      logger.error(err);

      switch (ctx.accepts('html', 'text', 'json')) {
        case 'text':
          ctx.type = 'text/plain';
          if (process.env.NODE_ENV !== 'production') {
            ctx.body = err.message;
          } else if (err.expose) {
            ctx.body = err.message;
          } else {
            throw err;
          }

          break;

        case 'json':
          ctx.type = 'application/json';
          if (process.env.NODE_ENV !== 'production') {
            ctx.body = { error: err.message };
          } else if (err.expose) {
            ctx.body = { error: err.message };
          } else {
            ctx.body = { error: _http.STATUS_CODES[ctx.status] };
          }

          break;

        case 'html':
          ctx.type = 'text/html';
          if (process.env.NODE_ENV !== 'production') {
            const parsedError = (0, _alouette.parse)(err);
            ctx.body = errorHtmlRenderer.render(parsedError);
          } else if (err.expose) {
            ctx.body = err.message;
          } else {
            throw err;
          }

          break;
      }
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map