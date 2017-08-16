'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpRouter;

var _routerSegments = require('router-segments');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RouterType = _flowRuntime2.default.tdz(function () {
  return _routerSegments.RouterType;
});

var AppType = _flowRuntime2.default.type('AppType', _flowRuntime2.default.any());

var ReturnType = _flowRuntime2.default.type('ReturnType', _flowRuntime2.default.function(_flowRuntime2.default.param('app', AppType), _flowRuntime2.default.return(_flowRuntime2.default.function(_flowRuntime2.default.param('ctx', _flowRuntime2.default.object()), _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.void()))))));

function alpRouter(router) {
  var _routerType = _flowRuntime2.default.ref(RouterType);

  var _returnType = _flowRuntime2.default.return(ReturnType);

  return _flowRuntime2.default.param('router', _routerType).assert(router), _returnType.assert(function (app) {

    return _flowRuntime2.default.param('app', AppType).assert(app), app.router = router, app.context.urlGenerator = function (routeKey, params) {
      var _routeKeyType = _flowRuntime2.default.string();

      var _paramsType = _flowRuntime2.default.any();

      var _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.string());

      return _flowRuntime2.default.param('routeKey', _routeKeyType).assert(routeKey), _flowRuntime2.default.param('params', _paramsType).assert(params), _returnType2.assert(router.toLocalizedPath(this.language, routeKey, params));
    }, app.context.redirectTo = function (to, params) {
      var _toType = _flowRuntime2.default.string();

      var _paramsType2 = _flowRuntime2.default.any();

      var _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.any());

      return _flowRuntime2.default.param('to', _toType).assert(to), _flowRuntime2.default.param('params', _paramsType2).assert(params), _returnType3.assert(this.redirect(router.toLocalizedPath(this.language, to, params)));
    }, function (ctx) {
      var _ctxType = _flowRuntime2.default.object();

      _flowRuntime2.default.param('ctx', _ctxType).assert(ctx);

      var routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) throw ctx.status = 404, new Error('Route not found: ' + ctx.path);

      return ctx.route = routeMatch, routeMatch.ref(ctx);
    };
  });
}
//# sourceMappingURL=index.js.map