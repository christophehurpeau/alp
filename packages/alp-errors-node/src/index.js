import { STATUS_CODES } from 'http';
import { parse as parseError } from 'alouette/src';
import ErrorHtmlRenderer from 'alouette/src/HtmlRenderer';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

export default async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        // eslint-disable-next-line no-ex-assign
        if (!err) err = new Error('Unknown error');
        ctx.status = err.status || 500;
        logger.error(err);

        switch (ctx.accepts('html', 'text', 'json')) {
            case 'text':
                ctx.type = 'text/plain';
                if (process.env.NODE_ENV !== 'production') {
                    ctx.body = err.message;
                } else if (err.expose) {
                    ctx.body = err.message;
                } else {
                    throw err;
                }

                break;

            case 'json':
                ctx.type = 'application/json';
                if (process.env.NODE_ENV !== 'production') {
                    ctx.body = { error: err.message };
                } else if (err.expose) {
                    ctx.body = { error: err.message };
                } else {
                    ctx.body = { error: STATUS_CODES[ctx.status] };
                }

                break;

            case 'html':
                ctx.type = 'text/html';
                if (process.env.NODE_ENV !== 'production') {
                    const parsedError = parseError(err);
                    ctx.body = errorHtmlRenderer.render(parsedError);
                } else if (err.expose) {
                    ctx.body = err.message;
                } else {
                    throw err;
                }

                break;
        }
    }
}
