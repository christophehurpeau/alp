import { promisify } from 'node:util';
import jsonwebtoken from 'jsonwebtoken';
import { Logger } from 'nightingale-logger';
import { EventEmitter } from 'node:events';
import { randomBytes } from 'node:crypto';
import Cookies from 'cookies';

function createAuthController({
  usersManager,
  authenticationService,
  homeRouterKey = "/",
  defaultStrategy,
  authHooks = {}
}) {
  return {
    async login(ctx) {
      const strategy = ctx.namedRouteParam("strategy") || defaultStrategy;
      if (!strategy) throw new Error("Strategy missing");
      const params = authHooks.paramsForLogin && (await authHooks.paramsForLogin(strategy, ctx)) || {};
      await authenticationService.redirectAuthUrl(ctx, strategy, {}, params);
    },
    /**
     * Add scope in existing
     * The user must already be connected
     */
    async addScope(ctx) {
      if (!ctx.state.loggedInUser) {
        ctx.redirectTo(homeRouterKey);
        return;
      }
      const strategy = ctx.namedRouteParam("strategy") || defaultStrategy;
      if (!strategy) throw new Error("Strategy missing");
      const scopeKey = ctx.namedRouteParam("scopeKey");
      if (!scopeKey) throw new Error("Scope missing");
      await authenticationService.redirectAuthUrl(ctx, strategy, {
        scopeKey
      });
    },
    async response(ctx) {
      const strategy = ctx.namedRouteParam("strategy");
      ctx.assert(strategy);
      const loggedInUser = await authenticationService.accessResponse(ctx, strategy, !!ctx.state.loggedInUser, {
        afterLoginSuccess: authHooks.afterLoginSuccess,
        afterScopeUpdate: authHooks.afterScopeUpdate
      });
      const keyPath = usersManager.store.keyPath;
      await ctx.setLoggedIn(loggedInUser[keyPath], loggedInUser);
      ctx.redirectTo(homeRouterKey);
    },
    // eslint-disable-next-line @typescript-eslint/require-await -- keep async in case i later need await in this method
    async logout(ctx) {
      ctx.logout();
      ctx.redirectTo(homeRouterKey);
    }
  };
}

const createRoutes = controller => ({
  login: ["/login/:strategy?", segment => {
    segment.add("/response", controller.response, "authResponse");
    segment.defaultRoute(controller.login, "login");
  }],
  addScope: ["/add-scope/:strategy/:scopeKey", controller.addScope],
  logout: ["/logout", controller.logout]
});

const randomBytesPromisified = promisify(randomBytes);
async function randomHex(size) {
  const buffer = await randomBytesPromisified(size);
  return buffer.toString("hex");
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable camelcase */
const logger$4 = new Logger("alp:auth:authentication");
class AuthenticationService extends EventEmitter {
  constructor(config, strategies, userAccountsService) {
    super();
    this.config = config;
    this.strategies = strategies;
    this.userAccountsService = userAccountsService;
  }
  generateAuthUrl(strategy, params) {
    logger$4.debug("generateAuthUrl", {
      strategy,
      params
    });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2":
        return strategyInstance.oauth2.authorizationCode.authorizeURL(params);
      default:
        throw new Error("Invalid strategy");
    }
  }
  async getTokens(strategy, options) {
    logger$4.debug("getTokens", {
      strategy,
      options
    });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2":
        {
          const result = await strategyInstance.oauth2.authorizationCode.getToken({
            code: options.code,
            redirect_uri: options.redirectUri
          });
          if (!result) return result;
          const tokens = result.token;
          return {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            tokenType: tokens.token_type,
            expiresIn: tokens.expires_in,
            expireDate: (() => {
              if (tokens.expires_in == null) return null;
              const d = new Date();
              d.setTime(d.getTime() + tokens.expires_in * 1000);
              return d;
            })(),
            idToken: tokens.id_token
          };
          // return strategyInstance.accessToken.create(result);
        }
      default:
        throw new Error("Invalid stategy");
    }
  }
  async refreshToken(strategy, tokensParam) {
    logger$4.debug("refreshToken", {
      strategy
    });
    if (!tokensParam.refreshToken) {
      throw new Error("Missing refresh token");
    }
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2":
        {
          const token = strategyInstance.oauth2.clientCredentials.createToken({
            refresh_token: tokensParam.refreshToken
          });
          const result = await token.refresh();
          const tokens = result.token;
          return {
            accessToken: tokens.access_token,
            tokenType: tokens.token_type,
            expiresIn: tokens.expires_in,
            expireDate: (() => {
              if (tokens.expires_in == null) return null;
              const d = new Date();
              d.setTime(d.getTime() + tokens.expires_in * 1000);
              return d;
            })(),
            idToken: tokens.id_token
          };
        }
      default:
        throw new Error("Invalid stategy");
    }
  }
  redirectUri(ctx, strategy) {
    const host = `http${this.config.get("allowHttps") ? "s" : ""}://${ctx.request.host}`;
    return `${host}${ctx.urlGenerator("authResponse", {
      strategy
    })}`;
  }
  async redirectAuthUrl(ctx, strategy, {
    refreshToken,
    scopeKey,
    user,
    accountId
  }, params) {
    logger$4.debug("redirectAuthUrl", {
      strategy,
      scopeKey,
      refreshToken
    });
    const state = await randomHex(8);
    const scope = this.userAccountsService.getScope(strategy, scopeKey || "login", user, accountId);
    if (!scope) {
      throw new Error("Invalid empty scope");
    }
    ctx.cookies.set(`auth_${strategy}_${state}`, JSON.stringify({
      scopeKey,
      scope,
      isLoginAccess: !scopeKey || scopeKey === "login"
    }), {
      maxAge: 600000,
      httpOnly: true,
      secure: this.config.get("allowHttps")
    });
    const redirectUri = this.generateAuthUrl(strategy, {
      redirect_uri: this.redirectUri(ctx, strategy),
      scope,
      state,
      access_type: refreshToken ? "offline" : "online",
      ...params
    });
    ctx.redirect(redirectUri);
  }
  async accessResponse(ctx, strategy, isLoggedIn, hooks) {
    const errorParam = ctx.params.queryParam("error").notEmpty();
    if (errorParam.isValid()) {
      ctx.throw(403, errorParam.value);
    }
    const code = ctx.validParams.queryParam("code").notEmpty().value;
    const state = ctx.validParams.queryParam("state").notEmpty().value;
    const cookieName = `auth_${strategy}_${state}`;
    const cookie = ctx.cookies.get(cookieName);
    ctx.cookies.set(cookieName, "", {
      expires: new Date(1)
    });
    if (!cookie) {
      throw new Error("No cookie for this state");
    }
    const parsedCookie = JSON.parse(cookie);
    if (!parsedCookie?.scope) {
      throw new Error("Unexpected cookie value");
    }
    if (!parsedCookie.isLoginAccess) {
      if (!isLoggedIn) {
        throw new Error("You are not connected");
      }
    }
    const tokens = await this.getTokens(strategy, {
      code,
      redirectUri: this.redirectUri(ctx, strategy)
    });
    if (parsedCookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromStrategy(strategy, tokens, parsedCookie.scope, parsedCookie.scopeKey);
      if (hooks.afterLoginSuccess) {
        await hooks.afterLoginSuccess(strategy, user);
      }
      return user;
    }
    const loggedInUser = ctx.state.loggedInUser;
    const {
      account,
      user
    } = await this.userAccountsService.update(loggedInUser, strategy, tokens, parsedCookie.scope, parsedCookie.scopeKey);
    if (hooks.afterScopeUpdate) {
      await hooks.afterScopeUpdate(strategy, parsedCookie.scopeKey, account, user);
    }
    return loggedInUser;
  }
  refreshAccountTokens(user, account) {
    if (account.tokenExpireDate && account.tokenExpireDate.getTime() > Date.now()) {
      return Promise.resolve(false);
    }
    return this.refreshToken(account.provider, {
      // accessToken: account.accessToken,
      refreshToken: account.refreshToken
    }).then(tokens => {
      if (!tokens) {
        // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: .OUTDATED });
        return false;
      }
      account.accessToken = tokens.accessToken;
      account.tokenExpireDate = tokens.expireDate;
      return this.userAccountsService.updateAccount(user, account).then(() => true);
    });
  }
}

const logger$3 = new Logger("alp:auth:userAccounts");
const STATUSES = {
  VALIDATED: "validated",
  DELETED: "deleted"
};
class UserAccountsService extends EventEmitter {
  constructor(usersManager, strategyToService) {
    super();
    this.usersManager = usersManager;
    this.strategyToService = strategyToService;
  }
  getScope(strategy, scopeKey, user, accountId) {
    logger$3.debug("getScope", {
      strategy,
      userId: user?._id
    });
    const service = this.strategyToService[strategy];
    if (!service) {
      throw new Error("Strategy not supported");
    }
    const newScope = service.scopeKeyToScope[scopeKey];
    if (!user || !accountId) {
      return newScope;
    }
    const account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);
    if (!account) {
      throw new Error("Could not found associated account");
    }
    return service.getScope(account.scope, newScope).join(" ");
  }
  async update(user, strategy, tokens, scope, subservice) {
    const service = this.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    const account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);
    if (!account) {
      // TODO check if already exists in other user => merge
      // TODO else add a new account in this user
      throw new Error("Could not found associated account");
    }
    account.status = "valid";
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate !== undefined) {
      account.tokenExpireDate = tokens.expireDate;
    }
    account.scope = service.getScope(account.scope, scope);
    account.subservices = account.subservices || [];
    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }
    await this.usersManager.replaceOne(user);
    return {
      user,
      account
    };
  }
  async findOrCreateFromStrategy(strategy, tokens, scope, subservice) {
    const service = this.strategyToService[strategy];
    if (!service) throw new Error("Strategy not supported");
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    if (!accountId) throw new Error("Invalid profile: no id found");
    const emails = service.getEmails(profile);
    let user = await this.usersManager.findOneByAccountOrEmails({
      provider: service.providerKey,
      accountId,
      emails
    });
    logger$3.info(!user ? "create user" : "existing user", {
      userId: user?._id,
      accountId
      /*emails , user*/
    });
    if (!user) {
      user = {};
    }
    Object.assign(user, {
      displayName: service.getDisplayName(profile),
      fullName: service.getFullName(profile),
      status: STATUSES.VALIDATED
    });
    if (!user.accounts) user.accounts = [];
    let account = user.accounts.find(account => account.provider === strategy && account.accountId === accountId);
    if (!account) {
      account = {
        provider: strategy,
        accountId
      };
      user.accounts.push(account);
    }
    account.name = service.getAccountName(profile);
    account.status = "valid";
    account.profile = profile;
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate !== undefined) {
      account.tokenExpireDate = tokens.expireDate;
    }
    account.scope = service.getScope(account.scope, scope);
    if (!account.subservices) account.subservices = [];
    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }
    if (!user.emails) user.emails = [];
    const userEmails = user.emails;
    emails.forEach(email => {
      if (!userEmails.includes(email)) {
        userEmails.push(email);
      }
    });
    user.emailDomains = [
    // eslint-disable-next-line unicorn/no-array-reduce
    ...user.emails.reduce((domains, email) => domains.add(email.split("@", 2)[1]), new Set())];
    const keyPath = this.usersManager.store.keyPath;
    if (user[keyPath]) {
      await this.usersManager.replaceOne(user);
    } else {
      await this.usersManager.insertOne(user);
    }
    return user;
  }
  async updateAccount(user, account) {
    await this.usersManager.updateAccount(user, account);
    return user;
  }
}

const COOKIE_NAME_TOKEN = "loggedInUserToken";
const COOKIE_NAME_STATE = "loggedInUserState";
const getTokenFromRequest = (req, options) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    return req.headers.authorization.slice(7);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const cookies = new Cookies(req, null, {
    ...options,
    secure: true
  });
  return cookies.get(COOKIE_NAME_TOKEN);
};

const verifyPromisified = promisify(jsonwebtoken.verify);
const createDecodeJWT = secretKey => async (token, jwtAudience) => {
  const result = await verifyPromisified(token, secretKey, {
    algorithms: ["HS512"],
    audience: jwtAudience
  });
  return result?.loggedInUserId;
};
const createFindLoggedInUser = (secretKey, usersManager, logger) => {
  const decodeJwt = createDecodeJWT(secretKey);
  return async (jwtAudience, token) => {
    if (!token || !jwtAudience) return [null, null];
    let loggedInUserId;
    try {
      loggedInUserId = await decodeJwt(token, jwtAudience);
    } catch (error) {
      logger.debug("failed to verify authentification", {
        err: error
      });
    }
    if (loggedInUserId == null) return [null, null];
    const loggedInUser = await usersManager.findById(loggedInUserId);
    if (!loggedInUser) return [null, null];
    return [loggedInUserId, loggedInUser];
  };
};

class MongoUsersManager {
  constructor(store) {
    this.store = store;
  }

  /** @deprecated use findById instead */
  findConnected(connected) {
    return this.store.findByKey(connected);
  }
  findById(userId) {
    return this.store.findByKey(userId);
  }
  insertOne(user) {
    return this.store.insertOne(user);
  }
  replaceOne(user) {
    return this.store.replaceOne(user);
  }
  sanitize(user) {
    return this.sanitizeBaseUser(user);
  }
  findOneByAccountOrEmails({
    accountId,
    emails,
    provider
  }) {
    let query = {
      "accounts.provider": provider,
      "accounts.accountId": accountId
    };
    if (emails && emails.length > 0) {
      query = {
        $or: [query, {
          emails: {
            $in: emails
          }
        }]
      };
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return this.store.findOne(query);
  }
  updateAccount(user, account) {
    const accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error("Invalid account");
    }
    return this.store.partialUpdateOne(user, {
      $set: {
        [`accounts.${accountIndex}`]: account
      }
    });
  }
  sanitizeBaseUser(user) {
    return {
      _id: user._id,
      created: user.created,
      updated: user.updated,
      displayName: user.displayName,
      fullName: user.fullName,
      status: user.status,
      emails: user.emails,
      emailDomains: user.emailDomains,
      accounts: user.accounts.map(account => ({
        provider: account.provider,
        accountId: account.accountId,
        name: account.name,
        status: account.status,
        profile: account.profile
      }))
    };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

class UserAccountGoogleService {
  constructor(scopeKeyToScope) {
    this.scopeKeyToScope = {
      ...scopeKeyToScope,
      login: "openid profile email"
    };
  }
  providerKey = "google";
  getProfile(tokens) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`).then(response => response.json());
  }
  getId(profile) {
    return profile.id;
  }
  getAccountName(profile) {
    return profile.email;
  }
  getEmails(profile) {
    const emails = [];
    if (profile.email) {
      emails.push(profile.email);
    }
    return emails;
  }
  getDisplayName(profile) {
    return profile.name;
  }
  getFullName(profile) {
    return {
      givenName: profile.given_name,
      familyName: profile.family_name
    };
  }
  getDefaultScope(newScope) {
    return this.getScope(undefined, newScope);
  }
  getScope(oldScope, newScope) {
    return !oldScope ? newScope.split(" ") : [...oldScope, ...newScope.split(" ")].filter((item, i, ar) => ar.indexOf(item) === i);
  }
}

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// https://api.slack.com/methods/users.identity

class UserAccountSlackService {
  constructor(scopeKeyToScope) {
    this.scopeKeyToScope = {
      ...scopeKeyToScope,
      login: "identity.basic identity.email identity.avatar"
    };
  }
  providerKey = "google";
  getProfile(tokens) {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return fetch(`https://slack.com/api/users.identity?token=${tokens.accessToken}`).then(response => response.json());
  }
  getId(profile) {
    if (!profile?.team?.id || !profile.user?.id) {
      return null;
    }
    return `team:${profile.team.id};user:${profile.user.id}`;
  }
  getAccountName(profile) {
    return profile.user.email;
  }
  getEmails(profile) {
    return profile.user.email ? [profile.user.email] : [];
  }
  getDisplayName(profile) {
    return profile.user.name;
  }
  getFullName() {
    return null;
  }
  getDefaultScope(newScope) {
    return this.getScope(undefined, newScope);
  }
  getScope(oldScope, newScope) {
    return !oldScope ? newScope.split(" ") : [...oldScope, ...newScope.split(" ")].filter((item, i, ar) => ar.indexOf(item) === i);
  }
}

const logger$2 = new Logger("alp:auth");
const authSocketIO = (app, usersManager, io, jwtAudience) => {
  const findLoggedInUser = createFindLoggedInUser(app.config.get("authentication").secretKey, usersManager, logger$2);
  const users = new Map();
  io.users = users;
  io.use(async (socket, next) => {
    const handshakeData = socket.request;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = getTokenFromRequest(handshakeData);
    if (!token) return next();
    const [loggedInUserId, loggedInUser] = await findLoggedInUser(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    jwtAudience || handshakeData.headers["user-agent"], token);
    if (!loggedInUserId || !loggedInUser) return next();
    socket.user = loggedInUser;
    users.set(socket.client.id, loggedInUser);
    socket.on("disconnected", () => users.delete(socket.client.id));
    await next();
  });
};

const logger$1 = new Logger("alp:auth");
const getTokenFromReq = req => {
  if (req.cookies) return req.cookies[COOKIE_NAME_TOKEN];
  return getTokenFromRequest(req);
};

/*
 * Not tested yet.
 * @internal
 */
const createAuthApolloContext = (config, usersManager) => {
  const findLoggedInUser = createFindLoggedInUser(config.get("authentication").secretKey, usersManager, logger$1);
  return async ({
    req,
    connection
  }) => {
    if (connection?.loggedInUser) {
      return {
        user: connection.loggedInUser
      };
    }
    if (!req) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = getTokenFromReq(req);
    if (!token) return {
      user: undefined
    };
    const [, loggedInUser] = await findLoggedInUser(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    req.headers["user-agent"], token);
    return {
      user: loggedInUser
    };
  };
};

const logger = new Logger("alp:auth");
const signPromisified = promisify(jsonwebtoken.sign);
function init({
  homeRouterKey,
  usersManager,
  strategies,
  defaultStrategy,
  strategyToService,
  authHooks,
  jwtAudience
}) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return app => {
    const userAccountsService = new UserAccountsService(usersManager, strategyToService);
    const authenticationService = new AuthenticationService(app.config, strategies, userAccountsService);
    const controller = createAuthController({
      usersManager,
      authenticationService,
      homeRouterKey,
      defaultStrategy,
      authHooks
    });
    app.context.setLoggedIn = async function setLoggedIn(loggedInUserId, loggedInUser) {
      logger.debug("setLoggedIn", {
        loggedInUser
      });
      if (!loggedInUserId) {
        throw new Error("Illegal value for setLoggedIn");
      }
      this.state.loggedInUserId = loggedInUserId;
      this.state.loggedInUser = loggedInUser;
      const token = await signPromisified({
        loggedInUserId,
        time: Date.now()
      }, this.config.get("authentication").get("secretKey"), {
        algorithm: "HS512",
        audience: jwtAudience || this.request.headers["user-agent"],
        expiresIn: "30 days"
      });
      this.cookies.set(COOKIE_NAME_TOKEN, token, {
        httpOnly: true,
        secure: this.config.get("allowHttps")
      });
      this.cookies.set(COOKIE_NAME_STATE, JSON.stringify({
        loggedInUserId,
        expiresIn: (() => {
          const date = new Date();
          date.setDate(date.getDate() + 30);
          return date.getTime();
        })()
      }), {
        httpOnly: false,
        secure: this.config.get("allowHttps")
      });
    };
    app.context.logout = function logout() {
      delete this.state.loggedInUserId;
      delete this.state.loggedInUser;
      this.cookies.set(COOKIE_NAME_TOKEN, "", {
        expires: new Date(1)
      });
      this.cookies.set(COOKIE_NAME_STATE, "", {
        expires: new Date(1)
      });
    };
    const findLoggedInUser = createFindLoggedInUser(app.config.get("authentication").secretKey, usersManager, logger);
    return {
      routes: createRoutes(controller),
      findLoggedInUserFromRequest: req => {
        const token = getTokenFromRequest(req);
        return findLoggedInUser(jwtAudience || req.headers["user-agent"], token);
      },
      findLoggedInUser,
      middleware: async (ctx, next) => {
        const token = ctx.cookies.get(COOKIE_NAME_TOKEN);
        const userAgent = ctx.request.headers["user-agent"];
        logger.debug("middleware", {
          token
        });
        const setState = (loggedInUserId, loggedInUser) => {
          ctx.state.loggedInUserId = loggedInUserId;
          ctx.state.user = loggedInUser;
          ctx.sanitizedState.loggedInUserId = loggedInUserId;
          ctx.sanitizedState.loggedInUser = loggedInUser && usersManager.sanitize(loggedInUser);
        };
        const [loggedInUserId, loggedInUser] = await findLoggedInUser(jwtAudience || userAgent, token);
        logger.debug("middleware", {
          loggedInUserId
        });
        if (loggedInUserId == null || loggedInUser == null) {
          if (token) {
            ctx.cookies.set(COOKIE_NAME_TOKEN, "", {
              expires: new Date(1)
            });
            ctx.cookies.set(COOKIE_NAME_STATE, "", {
              expires: new Date(1)
            });
          }
          setState(null, null);
          return next();
        }
        setState(loggedInUserId, loggedInUser);
        return next();
      }
    };
  };
}

export { AuthenticationService, MongoUsersManager, STATUSES, UserAccountGoogleService, UserAccountSlackService, authSocketIO, createAuthApolloContext, init as default };
//# sourceMappingURL=index-node20.mjs.map
