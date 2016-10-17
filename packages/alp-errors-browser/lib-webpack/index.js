function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

import { parse as parseError } from 'alouette';
// import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
import Logger from 'nightingale-logger';

var logger = new Logger('alp.errors');
// const errorHtmlRenderer = new ErrorHtmlRenderer();

export default (function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(ctx, next) {
        var parsedError;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return next();

                    case 3:
                        _context.next = 23;
                        break;

                    case 5:
                        _context.prev = 5;
                        _context.t0 = _context['catch'](0);

                        // eslint-disable-next-line no-ex-assign
                        if (!_context.t0) _context.t0 = new Error('Unknown error');
                        // eslint-disable-next-line no-ex-assign
                        if (typeof _context.t0 === 'string') _context.t0 = new Error(_context.t0);

                        ctx.status = _context.t0.status || 500;

                        if (!(process.env.NODE_ENV !== 'production')) {
                            _context.next = 17;
                            break;
                        }

                        parsedError = parseError(_context.t0);

                        logger.error(parsedError);
                        // ctx.body = errorHtmlRenderer.render(parsedError);
                        ctx.body = parsedError.stack;
                        // eslint-disable-next-line no-debugger, no-restricted-syntax
                        debugger;
                        _context.next = 23;
                        break;

                    case 17:
                        logger.error(_context.t0);

                        if (!_context.t0.expose) {
                            _context.next = 22;
                            break;
                        }

                        ctx.body = _context.t0.message;
                        _context.next = 23;
                        break;

                    case 22:
                        throw _context.t0;

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[0, 5]]);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=index.js.map