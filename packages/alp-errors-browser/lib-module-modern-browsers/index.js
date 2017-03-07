function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

const logger = new Logger('alp:errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

export default (function () {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      // eslint-disable-next-line no-ex-assign
      if (!err) err = new Error('Unknown error');
      // eslint-disable-next-line no-ex-assign
      if (typeof err === 'string') err = new Error(err);

      ctx.status = err.status || 500;

      logger.error(err);
      if (err.expose) {
        ctx.body = err.message;
      } else {
        throw err;
      }
    }
  });

  return function () {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map