import { PRODUCTION } from 'pob-babel';
import type { Context, Middleware, HtmlError } from 'alp-types';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = !PRODUCTION ? new ErrorHtmlRenderer() : undefined;

const createErrorInstanceIfNeeded = (
  err: Error | string | undefined | null | HtmlError,
): Error | HtmlError => {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  return err;
};

const errorMiddleware: Middleware = async function (ctx: Context, next) {
  try {
    await next();
  } catch (err) {
    const errInstance: Error | HtmlError = createErrorInstanceIfNeeded(err);

    ctx.status = (errInstance as HtmlError).status
      ? (errInstance as HtmlError).status
      : 500;

    logger.error(errInstance);

    if (errorHtmlRenderer) {
      ctx.body = errorHtmlRenderer.render(errInstance);
    } else if ((errInstance as HtmlError).expose) {
      ctx.body = errInstance.message;
    } else {
      throw errInstance;
    }
  }
};

export default errorMiddleware;
