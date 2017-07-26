'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = alpRouter;

var _routerSegments = require('router-segments');

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RouterType = _flowRuntime2.default.tdz(() => _routerSegments.RouterType);

const AppType = _flowRuntime2.default.type('AppType', _flowRuntime2.default.any());

const ReturnType = _flowRuntime2.default.type('ReturnType', _flowRuntime2.default.function(_flowRuntime2.default.param('app', AppType), _flowRuntime2.default.return(_flowRuntime2.default.function(_flowRuntime2.default.param('ctx', _flowRuntime2.default.object()), _flowRuntime2.default.return(_flowRuntime2.default.ref('Promise', _flowRuntime2.default.void()))))));

function alpRouter(router) {
  let _routerType = _flowRuntime2.default.ref(RouterType);

  const _returnType = _flowRuntime2.default.return(ReturnType);

  _flowRuntime2.default.param('router', _routerType).assert(router);

  return _returnType.assert(app => {
    _flowRuntime2.default.param('app', AppType).assert(app);

    app.router = router;

    app.context.urlGenerator = function (routeKey, params) {
      let _routeKeyType = _flowRuntime2.default.string();

      let _paramsType = _flowRuntime2.default.any();

      const _returnType2 = _flowRuntime2.default.return(_flowRuntime2.default.string());

      _flowRuntime2.default.param('routeKey', _routeKeyType).assert(routeKey);

      _flowRuntime2.default.param('params', _paramsType).assert(params);

      return _returnType2.assert(router.toLocalizedPath(this.language, routeKey, params));
    };

    app.context.redirectTo = function (to, params) {
      let _toType = _flowRuntime2.default.string();

      let _paramsType2 = _flowRuntime2.default.any();

      const _returnType3 = _flowRuntime2.default.return(_flowRuntime2.default.any());

      _flowRuntime2.default.param('to', _toType).assert(to);

      _flowRuntime2.default.param('params', _paramsType2).assert(params);

      return _returnType3.assert(this.redirect(router.toLocalizedPath(this.language, to, params)));
    };

    return ctx => {
      let _ctxType = _flowRuntime2.default.object();

      _flowRuntime2.default.param('ctx', _ctxType).assert(ctx);

      let routeMatch = router.find(ctx.path, ctx.language);

      if (!routeMatch) {
        ctx.status = 404;
        throw new Error(`Route not found: ${ctx.path}`);
      }

      ctx.route = routeMatch;

      return routeMatch.ref(ctx);
    };
  });
}
//# sourceMappingURL=index.js.map