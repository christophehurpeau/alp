import { STATUS_CODES } from 'http';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: process.cwd()
});

export default (async (ctx, next) => {
  try {
    await next();
  } catch (err) {

    switch (err || (err = new Error('Unknown error')), typeof err === 'string' && (err = new Error(err)), ctx.status = err.status || 500, logger.error(err), ctx.accepts('html', 'text', 'json')) {
      case 'text':
        if (ctx.type = 'text/plain', process.env.NODE_ENV !== 'production') ctx.body = err.message;else if (err.expose) ctx.body = err.message;else throw err;

        break;

      case 'json':
        ctx.type = 'application/json', ctx.body = process.env.NODE_ENV === 'production' ? err.expose ? { error: err.message } : { error: STATUS_CODES[ctx.status] } : { error: err.message };


        break;

      case 'html':
        if (ctx.type = 'text/html', process.env.NODE_ENV !== 'production') ctx.body = errorHtmlRenderer.render(err);else if (err.expose) ctx.body = err.message;else throw err;

    }
  }
});
//# sourceMappingURL=index.js.map