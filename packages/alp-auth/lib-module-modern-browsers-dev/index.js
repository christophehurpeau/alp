function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import abstractUsersManager from './models/user/abstractUsersManager';
import mongoUsersManager from './models/user/mongoUsersManager';
import rethinkUsersManager from './models/user/rethinkUsersManager';
import AuthenticationService from './services/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import createAuthController from './controllers/createAuthController.server';

import t from 'flow-runtime';
export { abstractUsersManager, mongoUsersManager, rethinkUsersManager };
export { default as routes } from './routes';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

export default function init({
  controllers,
  usersManager,
  strategies,
  loginModuleDescriptor,
  homeRouterKey
}) {
  t.param('arguments[0]', t.object(t.property('controllers', t.ref('Map', t.string(), t.any())), t.property('usersManager', t.object()), t.property('strategies', t.object()), t.property('loginModuleDescriptor', t.object()), t.property('homeRouterKey', t.nullable(t.string())))).assert(arguments[0]);

  return function (app) {
    const userAccountsService = new UserAccountsService(usersManager);

    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);

    controllers.set('auth', createAuthController({
      usersManager,
      authenticationService,
      loginModuleDescriptor,
      homeRouterKey
    }));

    app.context.setConnected = function () {
      var _ref = _asyncToGenerator(function* (connected, user) {
        var _this = this;

        let _connectedType = t.union(t.number(), t.string());

        let _userType = t.object();

        t.param('connected', _connectedType).assert(connected);
        t.param('user', _userType).assert(user);

        logger.debug('setConnected', { connected });
        if (!connected) {
          throw new Error('Illegal value for setConnected');
        }

        this.state.connected = connected;
        this.state.user = user;

        const token = yield promiseCallback(function (done) {
          return sign({ connected, time: Date.now() }, _this.config.get('authentication').get('secretKey'), {
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
    }();

    app.context.logout = function () {
      delete this.state.connected;
      delete this.state.user;
      this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    };

    app.registerBrowserStateTransformer(function (initialBrowserState, ctx) {
      if (ctx.state.connected) {
        initialBrowserState.connected = ctx.state.connected;
        initialBrowserState.user = usersManager.transformForBrowser(ctx.state.user);
      }
    });

    const decodeJwt = function decodeJwt(token, userAgent) {
      const result = verify(token, app.config.get('authentication').get('secretKey'), {
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

      app.websocket.use(function () {
        var _ref2 = _asyncToGenerator(function* (socket, next) {
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
      }());
    }

    return function () {
      var _ref3 = _asyncToGenerator(function* (ctx, next) {
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

      return function () {
        return _ref3.apply(this, arguments);
      };
    }();
  };
}
//# sourceMappingURL=index.js.map