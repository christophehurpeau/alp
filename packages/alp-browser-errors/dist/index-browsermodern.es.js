import ErrorHtmlRenderer from 'error-html';
import { Logger } from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = (process.env.NODE_ENV !== "production") ? new ErrorHtmlRenderer() : undefined;

const createErrorInstanceIfNeeded = err => {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  if (err instanceof Error) return err;
  return err;
};

const errorMiddleware = async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    const errInstance = createErrorInstanceIfNeeded(err);
    ctx.status = errInstance.status ? errInstance.status : 500;
    logger.error(errInstance);

    if (errorHtmlRenderer) {
      ctx.body = errorHtmlRenderer.render(errInstance);
    } else if (errInstance.expose) {
      ctx.body = errInstance.message;
    } else {
      throw errInstance;
    }
  }
};

export { errorMiddleware as default };
//# sourceMappingURL=index-browsermodern.es.js.map
