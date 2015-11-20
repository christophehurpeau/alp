import { createReadStream } from 'fs';
import { parse as parseUrl } from 'url';
import { parse as parseQueryString } from 'qs';
import HttpError from '../http/HttpError';
import RequestContext from '../http/RequestContext';

export function createRequestProcessor(app) {
    const error = function(request, response, status, error) {
        if (!error.code) {
            error = new HttpError(
                error && error.status || status,
                error && error.message || error,
                undefined,
                error
            );
        }

        response.httpError(error);
    };

    return (request, response) => {
        // TODO put parsed Url somewhere in request.
        const parsedUrl = parseUrl(request.url);
        const pathname = parsedUrl.pathname;

        request.app = app;
        request.response = response;
        response.request = request;

        if (pathname === '/favicon.ico') {
            app.logger.debug(
                null,
                { method: request.method, pathname },
                { method: ['gray'], pathname: ['gray'] }
            );

            return createReadStream(app.paths.public + 'favicon.ico')
                .on('error', error.bind(null, request, response, 404))
                .pipe(response);
        }

        if (pathname.startsWith('/web/')) {
            app.logger.debug(
                null,
                { method: request.method, pathname },
                { method: ['gray'], pathname: ['gray'] }
            );

            if (pathname.includes('/../')) {
                return error(request, response, 400, pathname + 'contains /../');
            }

            return createReadStream(app.paths.public + pathname.substr(5))
                .on('error', error.bind(null, request, response, 404))
                .pipe(response);
        }

        const started = Date.now();

        if (parsedUrl.query) {
            request.query = parseQueryString(parsedUrl.query);
        }

        let route;

        try {
            route = app.router.find(pathname);
        } catch (err) {
            return error(request, response, 500, err);
        }

        if (!route) {
            return error(request, response, 404, 'Route not found: ' + pathname);
        }

        const controller = app.controllers.get(route.controller);
        if (!controller) {
            return error(request, response, 404, 'Controller not found: ' + route.controller);
        }

        request.route = route;

        const context = new RequestContext(request, response);

        context.callAction(route.controller, route.action)
            .catch(err => error(request, response, 500, err))
            .catch(err => console.log(err.stack || err.message || err))
            .then(() => {
                var timeMs = Date.now() - started;
                var statusCode = response.statusCode;

                var stylesStatusCode;
                if (statusCode < 200) {
                    stylesStatusCode = [];
                } else if (statusCode < 300) {
                    stylesStatusCode = ['green', 'bold'];
                } else if (statusCode < 400) {
                    stylesStatusCode = ['blue', 'bold'];
                } else if (statusCode < 500) {
                    stylesStatusCode = ['bgMagenta', 'white'];
                } else if (statusCode < 600) {
                    stylesStatusCode = ['bgRed', 'white'];
                }

                app.logger.info(
                    'Request handled',
                    { method: request.method, statusCode, pathname, timeMs },
                    {
                        statusCode: stylesStatusCode,
                        pathname: ['magenta'],
                        timeMs: ['blue'],
                    }
                );
            });
    };
}
