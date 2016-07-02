import Logger from 'nightingale-logger';
import { EventEmitter } from 'events';
import compose from './compose';
import context from './context';
import request from './request';

const logger = new Logger('ibex');

export default class Application extends EventEmitter {
    middleware: Array<Function>;
    context: Object;

    constructor() {
        super();
        this.middleware = [];
        this.context = Object.create(context);
        this.context.app = this;
    }

    get environment(): string {
        return this.env;
    }

    use(fn: Function) {
        logger.debug('use', { name: fn.name || '-' });
        this.middleware.push(fn);
        return this;
    }

    onerror(e: any) {
        logger.error(e);
    }

    run(url: mixed) {
        if (!this.listeners('error').length) {
            this.on('error', this.onerror);
        }

        this.callback = compose(this.middleware);

        if (url) {
            this.load(url);
        }
    }

    createContext() {
        const context = Object.create(this.context);
        context.request = Object.create(request);
        context.state = {};
        return context;
    }

    load(url: string) {
        logger.debug('load', { url });

        if (url.startsWith('?')) {
            url = window.location.pathname + url;
        }

        const context = this.createContext();
        context.path = url;
        this.callback.call(context)
            .then(() => respond.call(context))
            .catch((err) => this.emit('error', err));
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
