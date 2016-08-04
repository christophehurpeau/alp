import { parse as parseError } from 'alouette';
// import ErrorHtmlRenderer from 'alouette/lib/HtmlRenderer';
import Logger from 'nightingale-logger';

const logger = new Logger('alp.errors');
// const errorHtmlRenderer = new ErrorHtmlRenderer();

export default async function (ctx, next) {
    try {
        await next();
    } catch (err) {
        ctx.status = err.status || 500;

        if (process.env.NODE_ENV !== 'production') {
            const parsedError = parseError(err);
            logger.error(parsedError);
            // ctx.body = errorHtmlRenderer.render(parsedError);
            ctx.body = parsedError.stack;
        } else {
            logger.error(err);
            if (err.expose) {
                ctx.body = err.message;
            } else {
                throw err;
            }
        }
    }
}
