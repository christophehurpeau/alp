import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';

export default class Application extends EventEmitter {
    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create(context);
        this._initPromises = [];
    }

    get environment() {
        return this.env;
    }

    init(fn) {
        this._initPromises.push(fn(this));
    }

    use(fn) {
        // logger.debug('use', {name: fn._name || fn.name || '-'});
        this.middleware.push(fn);
        return this;
    }

    onerror(e) {
        console.log(e.stack || e.message || e);
    }

    run() {
        return Promise.all(this._initPromises).then(() => {
            delete this._initPromises;

            if (!this.listeners('error').length) {
                this.on('error', this.onerror);
            }

            this.callback = compose(this.middleware);
        });
    }

    load(url) {
        if (url.startsWith('?')) {
            url = window.location.pathname + url;
        }

        const ctx = null;
        this.callback.call(ctx)
            .then(() => respond.call(ctx))
            .catch(ctx.onerror);
    }
}

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
