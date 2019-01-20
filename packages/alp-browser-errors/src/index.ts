import { PRODUCTION } from 'pob-babel';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';
import { Context, Middleware, HtmlError } from 'alp-types';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

const createErrorInstanceIfNeeded = (
  err: Error | string | undefined | null | HtmlError,
): Error | HtmlError => {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  return err;
};

const errorMiddleware: Middleware = async function(ctx: Context, next) {
  try {
    await next();
  } catch (err) {
    const errInstance: any = createErrorInstanceIfNeeded(err);

    ctx.status = errInstance.status ? errInstance.status : 500;

    logger.error(errInstance);

    if (!PRODUCTION) {
      ctx.body = errorHtmlRenderer.render(errInstance);
    } else if (errInstance.expose) {
      ctx.body = errInstance.message;
    } else {
      throw errInstance;
    }
  }
};

export default errorMiddleware;
