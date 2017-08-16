import { RouterType as _RouterType } from 'router-segments';

import t from 'flow-runtime';
var RouterType = t.tdz(function () {
  return _RouterType;
});
var AppType = t.type('AppType', t.any());
var ReturnType = t.type('ReturnType', t.function(t.param('app', AppType), t.return(t.function(t.param('ctx', t.object()), t.return(t.ref('Promise', t.void()))))));


export default function alpRouter(router) {
  var _routerType = t.ref(RouterType);

  var _returnType = t.return(ReturnType);

  return t.param('router', _routerType).assert(router), _returnType.assert(function (app) {

    return t.param('app', AppType).assert(app), app.router = router, app.context.urlGenerator = function (routeKey, params) {
      var _routeKeyType = t.string();

      var _paramsType = t.any();

      var _returnType2 = t.return(t.string());

      return t.param('routeKey', _routeKeyType).assert(routeKey), t.param('params', _paramsType).assert(params), _returnType2.assert(router.toLocalizedPath(this.language, routeKey, params));
    }, app.context.redirectTo = function (to, params) {
      var _toType = t.string();

      var _paramsType2 = t.any();

      var _returnType3 = t.return(t.any());

      return t.param('to', _toType).assert(to), t.param('params', _paramsType2).assert(params), _returnType3.assert(this.redirect(router.toLocalizedPath(this.language, to, params)));
    }, function (ctx) {
      var _ctxType = t.object();

      t.param('ctx', _ctxType).assert(ctx);

      var routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) throw ctx.status = 404, new Error('Route not found: ' + ctx.path);

      return ctx.route = routeMatch, routeMatch.ref(ctx);
    };
  });
}
//# sourceMappingURL=index.js.map