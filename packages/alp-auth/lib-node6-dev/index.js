'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.rethinkUsersManager = exports.mongoUsersManager = exports.abstractUsersManager = undefined;

var _routes = require('./routes');

Object.defineProperty(exports, 'routes', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_routes).default;
  }
});
exports.default = init;

var _tcombForked = require('tcomb-forked');

var _tcombForked2 = _interopRequireDefault(_tcombForked);

var _jsonwebtoken = require('jsonwebtoken');

var _promiseCallbackFactory = require('promise-callback-factory');

var _promiseCallbackFactory2 = _interopRequireDefault(_promiseCallbackFactory);

var _nightingaleLogger = require('nightingale-logger');

var _nightingaleLogger2 = _interopRequireDefault(_nightingaleLogger);

var _abstractUsersManager = require('./models/user/abstractUsersManager');

var _abstractUsersManager2 = _interopRequireDefault(_abstractUsersManager);

var _mongoUsersManager = require('./models/user/mongoUsersManager');

var _mongoUsersManager2 = _interopRequireDefault(_mongoUsersManager);

var _rethinkUsersManager = require('./models/user/rethinkUsersManager');

var _rethinkUsersManager2 = _interopRequireDefault(_rethinkUsersManager);

var _AuthenticationService = require('./services/AuthenticationService');

var _AuthenticationService2 = _interopRequireDefault(_AuthenticationService);

var _UserAccountsService = require('./services/user/UserAccountsService');

var _UserAccountsService2 = _interopRequireDefault(_UserAccountsService);

var _createAuthController = require('./controllers/createAuthController.server');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.abstractUsersManager = _abstractUsersManager2.default;
exports.mongoUsersManager = _mongoUsersManager2.default;
exports.rethinkUsersManager = _rethinkUsersManager2.default;


const COOKIE_NAME = 'connectedUser';
const logger = new _nightingaleLogger2.default('alp:auth');

function init(_ref) {
  var _assert2 = _assert(_ref, _tcombForked2.default.interface({
    controllers: Map,
    usersManager: _tcombForked2.default.Object,
    strategies: _tcombForked2.default.Object,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ controllers, usersManager, strategies, loginModuleDescriptor, homeRouterKey }');

  let controllers = _assert2.controllers,
      usersManager = _assert2.usersManager,
      strategies = _assert2.strategies,
      loginModuleDescriptor = _assert2.loginModuleDescriptor,
      homeRouterKey = _assert2.homeRouterKey;

  _assert(arguments[0], _tcombForked2.default.interface({
    controllers: Map,
    usersManager: _tcombForked2.default.Object,
    strategies: _tcombForked2.default.Object,
    loginModuleDescriptor: _tcombForked2.default.Object,
    homeRouterKey: _tcombForked2.default.maybe(_tcombForked2.default.String)
  }), '{ controllers, usersManager, strategies, loginModuleDescriptor, homeRouterKey }');

  return app => {
    const userAccountsService = new _UserAccountsService2.default(usersManager);

    const authenticationService = new _AuthenticationService2.default(app.config, strategies, userAccountsService);

    controllers.set('auth', (0, _createAuthController2.default)({
      usersManager,
      authenticationService,
      loginModuleDescriptor,
      homeRouterKey
    }));

    app.context.setConnected = (() => {
      var _ref2 = _asyncToGenerator(function* (connected, user) {
        var _this = this;

        _assert(connected, _tcombForked2.default.union([_tcombForked2.default.Number, _tcombForked2.default.String]), 'connected');

        _assert(user, _tcombForked2.default.Object, 'user');

        logger.debug('setConnected', { connected });
        if (!connected) {
          throw new Error('Illegal value for setConnected');
        }

        this.state.connected = connected;
        this.state.user = user;

        const token = yield (0, _promiseCallbackFactory2.default)(function (done) {
          return (0, _jsonwebtoken.sign)({ connected, time: Date.now() }, _this.config.get('authentication').get('secretKey'), {
            algorithm: 'HS512',
            audience: _this.request.headers['user-agent'],
            expiresIn: '30 days'
          }, done);
        });

        this.cookies.set(COOKIE_NAME, token, {
          httpOnly: true,
          secure: this.config.get('allowHttps')
        });
      });

      return function (_x, _x2) {
        return _ref2.apply(this, arguments);
      };
    })();

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    app.registerBrowserStateTransformer((initialBrowserState, ctx) => {
      if (ctx.state.connected) {
        initialBrowserState.connected = ctx.state.connected;
        initialBrowserState.user = usersManager.transformForBrowser(ctx.state.user);
      }
    });

    const decodeJwt = (token, userAgent) => {
      const result = (0, _jsonwebtoken.verify)(token, app.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: userAgent
      });
      return result && result.connected;
    };

    if (app.websocket) {
      logger.debug('app has websocket');
      // eslint-disable-next-line global-require
      const Cookies = require('cookies');

      const users = new Map();
      app.websocket.users = users;

      app.websocket.use((() => {
        var _ref3 = _asyncToGenerator(function* (socket, next) {
          const handshakeData = socket.request;
          const cookies = new Cookies(handshakeData, null, { keys: app.keys });
          let token = cookies.get(COOKIE_NAME);
          logger.debug('middleware websocket', { token });

          if (!token) return yield next();

          let connected;
          try {
            connected = yield decodeJwt(token, handshakeData.headers['user-agent']);
          } catch (err) {
            logger.info('failed to verify authentication', { err });
            return yield next();
          }
          logger.debug('middleware websocket', { connected });

          if (!connected) return yield next();

          const user = yield usersManager.findConnected(connected);

          if (!user) return yield next();

          users.set(socket.client.id, user);

          socket.on('disconnected', function () {
            return users.delete(socket.client.id);
          });

          yield next();
        });

        return function (_x3, _x4) {
          return _ref3.apply(this, arguments);
        };
      })());
    }

    return (() => {
      var _ref4 = _asyncToGenerator(function* (ctx, next) {
        let token = ctx.cookies.get(COOKIE_NAME);
        logger.debug('middleware', { token });

        if (!token) return yield next();

        let connected;
        try {
          connected = yield decodeJwt(token, ctx.request.headers['user-agent']);
        } catch (err) {
          logger.info('failed to verify authentification', { err });
          ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          return yield next();
        }
        logger.debug('middleware', { connected });

        if (!connected) return yield next();

        const user = yield usersManager.findConnected(connected);

        if (!user) {
          ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
          return yield next();
        }

        ctx.state.connected = connected;
        ctx.state.user = user;

        yield next();
      });

      return function (_x5, _x6) {
        return _ref4.apply(this, arguments);
      };
    })();
  };
}

function _assert(x, type, name) {
  function message() {
    return 'Invalid value ' + _tcombForked2.default.stringify(x) + ' supplied to ' + name + ' (expected a ' + _tcombForked2.default.getTypeName(type) + ')';
  }

  if (_tcombForked2.default.isType(type)) {
    if (!type.is(x)) {
      type(x, [name + ': ' + _tcombForked2.default.getTypeName(type)]);

      _tcombForked2.default.fail(message());
    }
  } else if (!(x instanceof type)) {
    _tcombForked2.default.fail(message());
  }

  return x;
}
//# sourceMappingURL=index.js.map