import { STATUS_CODES } from 'http';
import { parse as parseError } from 'alouette';
import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.errors');
const errorHtmlRenderer = new ErrorHtmlRenderer();

export default async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        const parsedError = parseError(err);
        logger.error(err);

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
                    ctx.body = { error: STATUS_CODES[ctx.status] };
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
}
