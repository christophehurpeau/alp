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
        this.context = Object.create(_context2.default);
    }

    get environment() {
        return this.env;
    }

    use(fn) {
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

    createContext() {
        const context = Object.create(this.context);
        context.state = {};
        return context;
    }

    load(url) {
        logger.debug('load', { url });

        if (url.startsWith('?')) {
            url = window.location.pathname + url;
        }

        const context = this.createContext();
        context.path = url;
        this.callback.call(context).then(() => respond.call(context)).catch(err => this.emit('error', err));
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
//# sourceMappingURL=index.js.map