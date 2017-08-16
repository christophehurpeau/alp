import { sign, verify } from 'jsonwebtoken';
import promiseCallback from 'promise-callback-factory';
import Logger from 'nightingale-logger';
import abstractUsersManager from './models/user/abstractUsersManager';
import mongoUsersManager from './models/user/mongoUsersManager';
import rethinkUsersManager from './models/user/rethinkUsersManager';
import AuthenticationService from './services/AuthenticationService';
import UserAccountsService from './services/user/UserAccountsService';
import createAuthController from './createAuthController';

import t from 'flow-runtime';
export { abstractUsersManager, mongoUsersManager, rethinkUsersManager };

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

export default function init(_arg) {
  let {
    usersManager,
    strategies,
    homeRouterKey
  } = t.object(t.property('usersManager', t.object()), t.property('strategies', t.object()), t.property('homeRouterKey', t.nullable(t.string()))).assert(_arg);

  return app => {
    const userAccountsService = new UserAccountsService(usersManager);

    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);

    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey
    });

    app.context.setConnected = async function (connected, user) {
      let _connectedType = t.union(t.number(), t.string());

      let _userType = t.object();

      if (t.param('connected', _connectedType).assert(connected), t.param('user', _userType).assert(user), logger.debug('setConnected', { connected }), !connected) throw new Error('Illegal value for setConnected');

      this.state.connected = connected, this.state.user = user;


      const token = await promiseCallback(done => sign({ connected, time: Date.now() }, this.config.get('authentication').get('secretKey'), {
        algorithm: 'HS512',
        audience: this.request.headers['user-agent'],
        expiresIn: '30 days'
      }, done));

      this.cookies.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: this.config.get('allowHttps')
      });
    }, app.context.logout = function () {
      delete this.state.connected, delete this.state.user, this.cookies.set(COOKIE_NAME, '', { expires: new Date(1) });
    }, app.registerBrowserStateTransformer((initialBrowserState, ctx) => {
      ctx.state.connected && (initialBrowserState.connected = ctx.state.connected || null, initialBrowserState.user = usersManager.transformForBrowser(ctx.state.user));
    });


    const decodeJwt = (token, userAgent) => {
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
      app.websocket.users = users, app.websocket.use(async (socket, next) => {
        const handshakeData = socket.request;
        const cookies = new Cookies(handshakeData, null, { keys: app.keys });
        let token = cookies.get(COOKIE_NAME);


        if (logger.debug('middleware websocket', { token }), !token) return next();

        let connected;
        try {
          connected = await decodeJwt(token, handshakeData.headers['user-agent']);
        } catch (err) {
          return logger.info('failed to verify authentication', { err }), next();
        }


        if (logger.debug('middleware websocket', { connected }), !connected) return next();

        const user = await usersManager.findConnected(connected);

        return user ? void (socket.user = user, users.set(socket.client.id, user), socket.on('disconnected', () => users.delete(socket.client.id)), await next()) : next();
      });
    }

    return {
      routes: {
        login: ['/login/:strategy', segment => {
          segment.add('/response', controller.loginResponse, 'loginResponse'), segment.defaultRoute(controller.login, 'login');
        }],
        logout: ['/logout', controller.logout]
      },

      middleware: async (ctx, next) => {
        let token = ctx.cookies.get(COOKIE_NAME);


        if (logger.debug('middleware', { token }), !token) return next();

        let connected;
        try {
          connected = await decodeJwt(token, ctx.request.headers['user-agent']);
        } catch (err) {
          return logger.info('failed to verify authentification', { err }), ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) }), next();
        }


        if (logger.debug('middleware', { connected }), !connected) return next();

        const user = await usersManager.findConnected(connected);

        return user ? void (ctx.state.connected = connected, ctx.state.user = user, await next()) : (ctx.cookies.set(COOKIE_NAME, '', { expires: new Date(1) }), next());
      }
    };
  };
}
//# sourceMappingURL=index.js.map