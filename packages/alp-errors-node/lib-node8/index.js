'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require('http');

var _errorHtml = require('error-html');

var _errorHtml2 = _interopRequireDefault(_errorHtml);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('alp:errors');
const errorHtmlRenderer = new _errorHtml2.default({
  appPath: process.cwd()
});

exports.default = async (ctx, next) => {
  try {
    await next();
  } catch (err) {

    switch (err || (err = new Error('Unknown error')), typeof err === 'string' && (err = new Error(err)), ctx.status = err.status || 500, logger.error(err), ctx.accepts('html', 'text', 'json')) {
      case 'text':
        if (ctx.type = 'text/plain', process.env.NODE_ENV !== 'production') ctx.body = err.message;else if (err.expose) ctx.body = err.message;else throw err;

        break;

      case 'json':
        ctx.type = 'application/json', ctx.body = process.env.NODE_ENV === 'production' ? err.expose ? { error: err.message } : { error: _http.STATUS_CODES[ctx.status] } : { error: err.message };


        break;

      case 'html':
        if (ctx.type = 'text/html', process.env.NODE_ENV !== 'production') ctx.body = errorHtmlRenderer.render(err);else if (err.expose) ctx.body = err.message;else throw err;

    }
  }
};
//# sourceMappingURL=index.js.map