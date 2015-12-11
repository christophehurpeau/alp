'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _alouette = require('alouette');

var _HtmlRenderer = require('alouette/lib/HtmlRenderer');

var _HtmlRenderer2 = _interopRequireDefault(_HtmlRenderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } step("next"); }); }; }

const errorHtmlRenderer = new _HtmlRenderer2.default();

process.on('uncaughtException', function (err) {
    try {
        (0, _alouette.log)(err);
    } catch (err2) {
        console.error(err.stack);
        console.error(err2.stack);
    }
});

exports.default = (function () {
    var ref = _asyncToGenerator(function* (ctx, next) {
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

    return function aukErrors(_x, _x2) {
        return ref.apply(this, arguments);
    };
})();
//# sourceMappingURL=index.js.map