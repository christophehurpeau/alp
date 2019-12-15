import _regeneratorRuntime from '@babel/runtime/regenerator';
import ErrorHtmlRenderer from 'error-html';
import Logger from 'nightingale-logger';

var logger = new Logger('alp:errors');
var errorHtmlRenderer = new ErrorHtmlRenderer();

var createErrorInstanceIfNeeded = function createErrorInstanceIfNeeded(err) {
  if (!err) return new Error('Unknown error');
  if (typeof err === 'string') return new Error(err);
  return err;
};

var errorMiddleware = function errorMiddleware(ctx, next) {
  var errInstance;
  return _regeneratorRuntime.async(function errorMiddleware$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return _regeneratorRuntime.awrap(next());

        case 3:
          _context.next = 15;
          break;

        case 5:
          _context.prev = 5;
          _context.t0 = _context["catch"](0);
          errInstance = createErrorInstanceIfNeeded(_context.t0);
          ctx.status = errInstance.status ? errInstance.status : 500;
          logger.error(errInstance);

          if (!errInstance.expose) {
            _context.next = 14;
            break;
          }

          ctx.body = errInstance.message;
          _context.next = 15;
          break;

        case 14:
          throw errInstance;

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 5]]);
};

export default errorMiddleware;
//# sourceMappingURL=index-browser.es.js.map
