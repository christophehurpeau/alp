import { STATUS_CODES } from 'http';
import { parse as parseError, log as logError } from 'alouette';
import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
const errorHtmlRenderer = new ErrorHtmlRenderer();

process.on('uncaughtException', function(err) {
    try {
        logError(err);
    } catch (err2) {
        console.error(err.stack);
        console.error(err2.stack);
    }
});

export default async function aukErrors(ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;
        const parsedError = parseError(err);
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
