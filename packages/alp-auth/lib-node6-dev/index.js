'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rethinkUsersManager = exports.mongoUsersManager = exports.abstractUsersManager = undefined;
exports.default = init;

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

var _createAuthController = require('./createAuthController');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.abstractUsersManager = _abstractUsersManager2.default;
exports.mongoUsersManager = _mongoUsersManager2.default;
exports.rethinkUsersManager = _rethinkUsersManager2.default;


const COOKIE_NAME = 'connectedUser';
const logger = new _nightingaleLogger2.default('alp:auth');

function init(_arg) {
  let {
    usersManager,
    strategies,
    homeRouterKey
  } = _flowRuntime2.default.object(_flowRuntime2.default.property('usersManager', _flowRuntime2.default.object()), _flowRuntime2.default.property('strategies', _flowRuntime2.default.object()), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string()), true)).assert(_arg);

  return app => {
    const userAccountsService = new _UserAccountsService2.default(usersManager);

    const authenticationService = new _AuthenticationService2.default(app.config, strategies, userAccountsService);

    const controller = (0, _createAuthController2.default)({
      usersManager,
      authenticationService,
      homeRouterKey
    });

    app.reduxReducers.user = (state = null) => state;
    app.reduxReducers.connected = (state = null) => state;

    app.context.setConnected = (() => {
      var _ref = _asyncToGenerator(function* (connected, user) {
        var _this = this;

        let _connectedType = _flowRuntime2.default.union(_flowRuntime2.default.number(), _flowRuntime2.default.string());

        let _userType = _flowRuntime2.default.object();

        _flowRuntime2.default.param('connected', _connectedType).assert(connected);

        _flowRuntime2.default.param('user', _userType).assert(user);

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

      return function () {
        return _ref.apply(this, arguments);
      };
    })();

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

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
        var _ref2 = _asyncToGenerator(function* (socket, next) {
          const handshakeData = socket.request;
          const cookies = new Cookies(handshakeData, null, { keys: app.keys });
          let token = cookies.get(COOKIE_NAME);
          logger.debug('middleware websocket', { token });

          if (!token) return next();

          let connected;
          try {
            connected = yield decodeJwt(token, handshakeData.headers['user-agent']);
          } catch (err) {
            logger.info('failed to verify authentication', { err });
            return next();
          }
          logger.debug('middleware websocket', { connected });

          if (!connected) return next();

          const user = yield usersManager.findConnected(connected);

          if (!user) return next();

          socket.user = user;
          users.set(socket.client.id, user);

          socket.on('disconnected', function () {
            return users.delete(socket.client.id);
          });

          yield next();
        });

        return function () {
          return _ref2.apply(this, arguments);
        };
      })());
    }

    return {
      routes: {
        login: ['/login/:strategy', segment => {
          segment.add('/response', controller.loginResponse, 'loginResponse');
          segment.defaultRoute(controller.login, 'login');
        }],
        logout: ['/logout', controller.logout]
      },

      middleware: (() => {
        var _ref3 = _asyncToGenerator(function* (ctx, next) {
          let token = ctx.cookies.get(COOKIE_NAME);
          logger.debug('middleware', { token });

          const setState = function (connected, user) {
            ctx.state.connected = connected;
            ctx.state.user = user;
            if (ctx.reduxInitialContext) {
              ctx.reduxInitialContext.connected = connected;
              ctx.reduxInitialContext.user = user && usersManager.transformForBrowser(user);
            }
          };

          const notConnected = function () {
            setState(null, null);
            return next();
          };

          if (!token) return notConnected();

          let connected;
          try {
            connected = yield decodeJwt(token, ctx.request.headers['user-agent']);
          } catch (err) {
            logger.info('failed to verify authentification', { err });
            ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
            return notConnected();
          }
          logger.debug('middleware', { connected });

          if (!connected) return notConnected();

          const user = yield usersManager.findConnected(connected);

          if (!user) {
            ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
            return notConnected();
          }

          setState(connected, user);
          return next();
        });

        return function middleware() {
          return _ref3.apply(this, arguments);
        };
      })()
    };
  };
}
//# sourceMappingURL=index.js.map