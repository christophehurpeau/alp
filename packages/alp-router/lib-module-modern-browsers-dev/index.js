import { RouterType as _RouterType } from 'router-segments';

import t from 'flow-runtime';
const RouterType = t.tdz(function () {
  return _RouterType;
});
const AppType = t.type('AppType', t.any());
const ReturnType = t.type('ReturnType', t.function(t.param('app', AppType), t.return(t.function(t.param('ctx', t.object()), t.return(t.ref('Promise', t.void()))))));


export default function alpRouter(router) {
  let _routerType = t.ref(RouterType);

  const _returnType = t.return(ReturnType);

  return t.param('router', _routerType).assert(router), _returnType.assert(function (app) {

    return t.param('app', AppType).assert(app), app.router = router, app.context.urlGenerator = function (routeKey, params) {
      let _routeKeyType = t.string();

      let _paramsType = t.any();

      const _returnType2 = t.return(t.string());

      return t.param('routeKey', _routeKeyType).assert(routeKey), t.param('params', _paramsType).assert(params), _returnType2.assert(router.toLocalizedPath(this.language, routeKey, params));
    }, app.context.redirectTo = function (to, params) {
      let _toType = t.string();

      let _paramsType2 = t.any();

      const _returnType3 = t.return(t.any());

      return t.param('to', _toType).assert(to), t.param('params', _paramsType2).assert(params), _returnType3.assert(this.redirect(router.toLocalizedPath(this.language, to, params)));
    }, function (ctx) {
      let _ctxType = t.object();

      t.param('ctx', _ctxType).assert(ctx);

      let routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) throw ctx.status = 404, new Error(`Route not found: ${ctx.path}`);

      return ctx.route = routeMatch, routeMatch.ref(ctx);
    };
  });
}
//# sourceMappingURL=index.js.map