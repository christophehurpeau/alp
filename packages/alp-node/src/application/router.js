import { RouterBuilder, RoutesTranslations } from 'limosa';

export function createRouter(app) {
    const routeTranslationsConfig = app.config.get('routeTranslations');
    const routeTranslations = new RoutesTranslations(routeTranslationsConfig);
    console.log(routeTranslations);
    const builder = new RouterBuilder(routeTranslations, ['en', 'fr']);
    app.require('router')(builder);
    return builder.router;
}
