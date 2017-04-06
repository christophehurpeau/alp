'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = exports.rethinkUsersManager = exports.mongoUsersManager = exports.abstractUsersManager = undefined;

var _routes = require('./routes');

Object.defineProperty(exports, 'routes', {
  enumerable: true,
  get: function () {
    return _interopRequireDefault(_routes).default;
  }
});
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

var _createAuthController = require('./controllers/createAuthController.server');

var _createAuthController2 = _interopRequireDefault(_createAuthController);

var _flowRuntime = require('flow-runtime');

var _flowRuntime2 = _interopRequireDefault(_flowRuntime);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.abstractUsersManager = _abstractUsersManager2.default;
exports.mongoUsersManager = _mongoUsersManager2.default;
exports.rethinkUsersManager = _rethinkUsersManager2.default;


const COOKIE_NAME = 'connectedUser';
const logger = new _nightingaleLogger2.default('alp:auth');

function init(_arg) {
  let {
    controllers,
    usersManager,
    strategies,
    loginModuleDescriptor,
    homeRouterKey
  } = _flowRuntime2.default.object(_flowRuntime2.default.property('controllers', _flowRuntime2.default.ref('Map', _flowRuntime2.default.string(), _flowRuntime2.default.any())), _flowRuntime2.default.property('usersManager', _flowRuntime2.default.object()), _flowRuntime2.default.property('strategies', _flowRuntime2.default.object()), _flowRuntime2.default.property('loginModuleDescriptor', _flowRuntime2.default.object()), _flowRuntime2.default.property('homeRouterKey', _flowRuntime2.default.nullable(_flowRuntime2.default.string()))).assert(_arg);

  return app => {
    const userAccountsService = new _UserAccountsService2.default(usersManager);

    const authenticationService = new _AuthenticationService2.default(app.config, strategies, userAccountsService);

    controllers.set('auth', (0, _createAuthController2.default)({
      usersManager,
      authenticationService,
      loginModuleDescriptor,
      homeRouterKey
    }));

    app.context.setConnected = async function (connected, user) {
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

      const token = await (0, _promiseCallbackFactory2.default)(done => (0, _jsonwebtoken.sign)({ connected, time: Date.now() }, this.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: this.request.headers['user-agent'],
        expiresIn: '30 days'
      }, done));

      this.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps')
      });
    };

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

      app.websocket.use(async (socket, next) => {
        const handshakeData = socket.request;
        const cookies = new Cookies(handshakeData, null, { keys: app.keys });
        let token = cookies.get(COOKIE_NAME);
        logger.debug('middleware websocket', { token });

        if (!token) return await next();

        let connected;
        try {
          connected = await decodeJwt(token, handshakeData.headers['user-agent']);
        } catch (err) {
          logger.info('failed to verify authentication', { err });
          return await next();
        }
        logger.debug('middleware websocket', { connected });

        if (!connected) return await next();

        const user = await usersManager.findConnected(connected);

        if (!user) return await next();

        socket.user = user;
        users.set(socket.client.id, user);

        socket.on('disconnected', () => users.delete(socket.client.id));

        await next();
      });
    }

    return async (ctx, next) => {
      let token = ctx.cookies.get(COOKIE_NAME);
      logger.debug('middleware', { token });

      if (!token) return await next();

      let connected;
      try {
        connected = await decodeJwt(token, ctx.request.headers['user-agent']);
      } catch (err) {
        logger.info('failed to verify authentification', { err });
        ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
        return await next();
      }
      logger.debug('middleware', { connected });

      if (!connected) return await next();

      const user = await usersManager.findConnected(connected);

      if (!user) {
        ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
        return await next();
      }

      ctx.state.connected = connected;
      ctx.state.user = user;

      await next();
    };
  };
}
//# sourceMappingURL=index.js.map