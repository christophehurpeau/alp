'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _events = require('events');

var _compose = require('./compose');

var _compose2 = _interopRequireDefault(_compose);

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const logger = new _nightingaleLogger2.default('ibex');

class Application extends _events.EventEmitter {

    constructor() {
        super();
        this.middleware = [];

        if (!(Array.isArray(this.middleware) && this.middleware.every(function (item) {
            return typeof item === 'function';
        }))) {
            throw new TypeError('Value of "this.middleware" violates contract.\n\nExpected:\nArray<Function>\n\nGot:\n' + _inspect(this.middleware));
        }

        this.context = Object.create(_context2.default);

        if (!(this.context instanceof Object)) {
            throw new TypeError('Value of "this.context" violates contract.\n\nExpected:\nObject\n\nGot:\n' + _inspect(this.context));
        }
    }

    get environment() {
        function _ref(_id) {
            if (!(typeof _id === 'string')) {
                throw new TypeError('Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id));
            }

            return _id;
        }

        return _ref(this.env);
    }

    use(fn) {
        if (!(typeof fn === 'function')) {
            throw new TypeError('Value of argument "fn" violates contract.\n\nExpected:\nFunction\n\nGot:\n' + _inspect(fn));
        }

        logger.debug('use', { name: fn.name || '-' });
        this.middleware.push(fn);
        return this;
    }

    onerror(e) {
        logger.error(e);
    }

    run(url) {
        if (!this.listeners('error').length) {
            this.on('error', this.onerror);
        }

        this.callback = (0, _compose2.default)(this.middleware);

        if (url) {
            this.load(url);
        }
    }

    load(url) {
        if (!(typeof url === 'string')) {
            throw new TypeError('Value of argument "url" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(url));
        }

        logger.debug('load', { url: url });

        if (url.startsWith('?')) {
            url = window.location.pathname + url;
        }

        const context = Object.create(this.context);
        context.path = url;
        this.callback.call(context).then(() => {
            return respond.call(context);
        }).catch(err => {
            return this.emit('error', err);
        });
    }
}

exports.default = Application;
function respond() {
    // allow bypassing
    if (this.respond === false) {
        return;
    }

    if (!this.writable) return;

    let body = this.body;
    // let code = this.status;

    if (typeof body === 'string') {
        document.body.innerHTML = body;
        return;
    }

    if (body.nodeType) {
        document.body.innerHTML = '';
        document.body.appendChild(body);
    }

    throw new Error('Invalid body result');
}

function _inspect(input, depth) {
    const maxDepth = 4;
    const maxKeys = 15;

    if (depth === undefined) {
        depth = 0;
    }

    depth += 1;

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input;
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            if (depth > maxDepth) return '[...]';

            const first = _inspect(input[0], depth);

            if (input.every(item => _inspect(item, depth) === first)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        const keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        const indent = '  '.repeat(depth - 1);
        let entries = keys.slice(0, maxKeys).map(key => {
            return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
        }).join('\n  ' + indent);

        if (keys.length >= maxKeys) {
            entries += '\n  ' + indent + '...';
        }

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
        } else {
            return '{\n  ' + indent + entries + '\n' + indent + '}';
        }
    }
}
//# sourceMappingURL=index.js.map