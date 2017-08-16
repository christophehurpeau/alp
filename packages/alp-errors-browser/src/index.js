import ErrorHtmlRenderer from 'error-html/src';
import Logger from 'nightingale-logger/src';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

export default async function(ctx, next) {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-ex-assign
    if (!err) err = new Error('Unknown error');
    // eslint-disable-next-line no-ex-assign
    if (typeof err === 'string') err = new Error(err);

    ctx.status = err.status || 500;

    logger.error(err);
    if (!PRODUCTION) {
      ctx.body = errorHtmlRenderer.render(err);
    } else if (err.expose) {
      ctx.body = err.message;
    } else {
      throw err;
    }
  }
}
