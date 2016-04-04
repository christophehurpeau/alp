'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = alpBodyParser;

var _coBody = require('co-body');

var _coBody2 = _interopRequireDefault(_coBody);

/**
 * @function
 * @param obj
*/
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @function
 * @param type
 * @param ctx
*/

function parseBody(type, ctx) {
    if (ctx.request.body) {
        throw new Error('Request is already parsed');
    }

    return _coBody2.default[type](ctx).then(body => {
        ctx.request.body = body;
        return body;
    });
}

/**
 * @param {Koa} app
 */
/**
 * @function
 * @param app
*/function alpBodyParser(app) {
    app.context.parseBody = /**
                             * @function
                            */function () {
        return parseBody('form', this);
    };

    app.context.parseBodyJson = /**
                                 * @function
                                */function () {
        return parseBody('json', this);
    };

    app.context.parseBodyText = /**
                                 * @function
                                */function () {
        return parseBody('text', this);
    };
}
//# sourceMappingURL=index.js.map