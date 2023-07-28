import { STATUS_CODES } from 'node:http';
import ErrorHtmlRenderer from 'error-html';
import { Logger } from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer({
  appPath: `${process.cwd()}/`
});
async function alpNodeErrors(ctx, next) {
  try {
    await next();
  } catch (error) {
    // eslint-disable-next-line no-ex-assign
    if (!error) error = new Error('Unknown error');
    // eslint-disable-next-line no-ex-assign
    if (typeof error === 'string') error = new Error(error);
    ctx.status = error.status || 500;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    logger.error(error);

    // eslint-disable-next-line @typescript-eslint/switch-exhaustiveness-check
    switch (ctx.request.accepts('html', 'text', 'json')) {
      case 'text':
        ctx.type = 'text/plain';
        if (process.env.NODE_ENV !== 'production' || error.expose) {
          ctx.body = error.message;
        } else {
          throw error;
        }
        break;
      case 'json':
        ctx.type = 'application/json';
        if (process.env.NODE_ENV !== 'production' || error.expose) {
          ctx.body = {
            error: error.message
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
          ctx.body = errorHtmlRenderer.render(error);
        } else if (error.expose) {
          ctx.body = error.message;
        } else {
          throw error;
        }
        break;
    }
  }
}

export { alpNodeErrors as default };
//# sourceMappingURL=index-node18.mjs.map
