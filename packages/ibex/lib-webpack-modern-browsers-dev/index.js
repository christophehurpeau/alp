import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';

var logger = new Logger('ibex');

export default class Application extends EventEmitter {

    constructor() {
        super();
        this.middleware = [];

        if (!(Array.isArray(this.middleware) && this.middleware.every(function (item) {
            return typeof item === 'function';
        }))) {
            throw new TypeError('Value of "this.middleware" violates contract.\n\nExpected:\nArray<Function>\n\nGot:\n' + _inspect(this.middleware));
        }

        this.context = Object.create(context);

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

        this.callback = compose(this.middleware);

        if (url) {
            this.load(url);
        }
    }

    createContext() {
        var context = Object.create(this.context);
        context.state = {};
        return context;
    }

    load(url) {
        if (!(typeof url === 'string')) {
            throw new TypeError('Value of argument "url" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(url));
        }

        logger.debug('load', { url });

        if (url.startsWith('?')) {
            url = window.location.pathname + url;
        }

        var context = this.createContext();
        context.path = url;
        this.callback.call(context).then(() => {
            return respond.call(context);
        }).catch(err => {
            return this.emit('error', err);
        });
    }
}

function respond() {
    // allow bypassing
    if (this.respond === false) {
        return;
    }

    if (!this.writable) return;

    var body = this.body;
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
    var maxDepth = 4;
    var maxKeys = 15;

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
            var _ret = function () {
                if (depth > maxDepth) return {
                        v: '[...]'
                    };

                var first = _inspect(input[0], depth);

                if (input.every(item => _inspect(item, depth) === first)) {
                    return {
                        v: first.trim() + '[]'
                    };
                } else {
                    return {
                        v: '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']'
                    };
                }
            }();

            if (typeof _ret === "object") return _ret.v;
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        if (depth > maxDepth) return '{...}';
        var indent = '  '.repeat(depth - 1);
        var entries = keys.slice(0, maxKeys).map(key => {
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