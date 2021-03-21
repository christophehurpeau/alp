import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');

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

    if (errInstance.expose) {
      ctx.body = errInstance.message;
    } else {
      throw errInstance;
    }
  }
};

export default errorMiddleware;
//# sourceMappingURL=index-browsermodern.es.js.map
