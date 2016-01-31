'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _alouette = require('alouette');

var _HtmlRenderer = require('alouette/lib/HtmlRenderer');

var _HtmlRenderer2 = _interopRequireDefault(_HtmlRenderer);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param fn
*/
function _asyncToGenerator(fn) { return (/**
                                         * @function
                                        */ function () { var gen = fn.apply(this, arguments); return new Promise( /**
                                                                                                                   * @function
                                                                                                                   * @param resolve
                                                                                                                   * @param reject
                                                                                                                  */ function (resolve, reject) { /**
                                                                                                                                                   * @function
                                                                                                                                                   * @param key
                                                                                                                                                   * @param arg
                                                                                                                                                  */ function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then( /**
                                                                                                                                                                                                                                                                                                                                                                 * @function
                                                                                                                                                                                                                                                                                                                                                                 * @param value
                                                                                                                                                                                                                                                                                                                                                                */ function (value) { return step("next", value); }, /**
                                                                                                                                                                                                                                                                                                                                                                                                                      * @function
                                                                                                                                                                                                                                                                                                                                                                                                                      * @param err
                                                                                                                                                                                                                                                                                                                                                                                                                     */ function (err) { return step("throw", err); }); } } return step("next"); }); } ); }

const errorHtmlRenderer = new _HtmlRenderer2.default();

process.on('uncaughtException', err => {
    try {
        (0, _alouette.log)(err);
    } catch (err2) {
        /* eslint-disable no-console */
        console.error(err.stack);
        console.error(err2.stack);
        /* eslint-enable no-console */
    }
});

exports.default = /**
                   * @function
                   * @param ctx
                   * @param next
                  */ /**
                      * @function
                     */function () {
    var ref = _asyncToGenerator( /**
                                  * @function
                                  * @param ctx
                                  * @param next
                                 */function* (ctx, next) {
        try {
            yield next();
        } catch (err) {
            ctx.status = err.status || 500;
            const parsedError = (0, _alouette.parse)(err);
            ctx.app.logger.error(parsedError.toString());

            switch (ctx.accepts('html', 'text', 'json')) {
                case 'text':
                    ctx.type = 'text/plain';
                    if (!ctx.app.production) {
                        ctx.body = err.message;
                    } else if (err.expose) {
                        ctx.body = err.message;
                    } else {
                        throw err;
                    }

                    break;

                case 'json':
                    ctx.type = 'application/json';
                    if (!ctx.app.production) {
                        ctx.body = { error: err.message };
                    } else if (err.expose) {
                        ctx.body = { error: err.message };
                    } else {
                        ctx.body = { error: _http.STATUS_CODES[ctx.status] };
                    }

                    break;

                case 'html':
                    ctx.type = 'text/html';
                    if (!ctx.app.production) {
                        ctx.body = errorHtmlRenderer.render(parsedError);
                    } else if (err.expose) {
                        ctx.body = err.message;
                    } else {
                        throw err;
                    }

                    break;
            }
        }
    });

    return (/**
            * @function
            * @param _x
            * @param _x2
           */function (_x, _x2) {
            return ref.apply(this, arguments);
        }
    );
}();
//# sourceMappingURL=index.js.map