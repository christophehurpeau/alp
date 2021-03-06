import { STATUS_CODES } from 'http';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

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

    switch (ctx.request.accepts('html', 'text', 'json')) {
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
            error: STATUS_CODES[ctx.status]
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

export default alpNodeErrors;
//# sourceMappingURL=index-node12.mjs.map
