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

exports.default = async function (ctx, next) {
  try {
    await next();
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
          ctx.body = errorHtmlRenderer.render(err);
        } else if (err.expose) {
          ctx.body = err.message;
        } else {
          throw err;
        }

        break;
    }
  }
};
//# sourceMappingURL=index.js.map