'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const http = require('http');
const ErrorHtmlRenderer = _interopDefault(require('error-html'));
const Logger = _interopDefault(require('nightingale-logger'));

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: `${process.cwd()}/`
});
async function alpNodeErrors(ctx, next) {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-ex-assign
    if (!err) err = new Error('Unknown error'); // eslint-disable-next-line no-ex-assign

    if (typeof err === 'string') err = new Error(err);
    ctx.status = err.status || 500;
    logger.error(err);

    switch (ctx.accepts('html', 'text', 'json')) {
      case 'text':
        ctx.type = 'text/plain';

        if (process.env.NODE_ENV !== 'production' || err.expose) {
          ctx.body = err.message;
        } else {
          throw err;
        }

        break;

      case 'json':
        ctx.type = 'application/json';

        if (process.env.NODE_ENV !== 'production' || err.expose) {
          ctx.body = {
            error: err.message
          };
        } else {
          ctx.body = {
            error: http.STATUS_CODES[ctx.status]
          };
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
}

exports.default = alpNodeErrors;
//# sourceMappingURL=index-node10.cjs.js.map
