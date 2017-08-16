import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

export default (async function (ctx, next) {
  try {
    await next();
  } catch (err) {
    if (err || (err = new Error('Unknown error')), typeof err === 'string' && (err = new Error(err)), ctx.status = err.status || 500, logger.error(err), err.expose) ctx.body = err.message;else throw err;
  }
});
//# sourceMappingURL=index.js.map