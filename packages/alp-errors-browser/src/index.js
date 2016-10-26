import { parse as parseError } from 'alouette';
// import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
import Logger from 'nightingale-logger/src';

const logger = new Logger('alp:errors');
// const errorHtmlRenderer = new ErrorHtmlRenderer();

export default async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-ex-assign
    if (!err) err = new Error('Unknown error');
    // eslint-disable-next-line no-ex-assign
    if (typeof err === 'string') err = new Error(err);

    ctx.status = err.status || 500;

    if (!PRODUCTION) {
      const parsedError = parseError(err);
      logger.error(parsedError);
      // ctx.body = errorHtmlRenderer.render(parsedError);
      ctx.body = parsedError.stack;
      // eslint-disable-next-line no-debugger, no-restricted-syntax
      debugger;
    } else {
      logger.error(err);
      if (err.expose) {
        ctx.body = err.message;
      } else {
        throw err;
      }
    }
  }
}
