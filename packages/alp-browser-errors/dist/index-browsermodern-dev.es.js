import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

const createErrorInstanceIfNeeded = err => {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
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

export default errorMiddleware;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
