function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { parse as parseError } from 'alouette';
// import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
import Logger from 'nightingale-logger';

var logger = new Logger('alp:errors');
// const errorHtmlRenderer = new ErrorHtmlRenderer();

export default (() => {
  var _ref = _asyncToGenerator(function* (ctx, next) {
    try {
      yield next();
    } catch (err) {
      // eslint-disable-next-line no-ex-assign
      if (!err) err = new Error('Unknown error');
      // eslint-disable-next-line no-ex-assign
      if (typeof err === 'string') err = new Error(err);

      ctx.status = err.status || 500;

      {
        var parsedError = parseError(err);
        logger.error(parsedError);
        // ctx.body = errorHtmlRenderer.render(parsedError);
        ctx.body = parsedError.stack;
        // eslint-disable-next-line no-debugger, no-restricted-syntax
        debugger;
      }
    }
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();
//# sourceMappingURL=index.js.map