/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable camelcase */
import { EventEmitter } from "node:events";
import type { Context, NodeConfig } from "alp-node";
import { Logger } from "nightingale-logger";
import type { Strategy as Oauth2Strategy } from "../../../strategies/strategies.d";
import type { AccountId, User, Account, UserSanitized } from "../../types";
import { randomHex } from "../../utils/generators";
import type UserAccountsService from "../user/UserAccountsService";
import type { AllowedStrategyKeys, Tokens } from "./types";

const logger = new Logger("alp:auth:authentication");

export interface GenerateAuthUrlOptions {
  accessType?: string;
  grantType?: string;
  includeGrantedScopes?: boolean;
  loginHint?: string;
  prompt?: string;
  redirectUri?: string;
  scope?: string;
  state?: string;
}

export interface GetTokensOptions {
  code: string;
  redirectUri: string;
}

export type Strategies<StrategyKeys extends AllowedStrategyKeys> = Record<
  StrategyKeys,
  Oauth2Strategy<any>
>;

export interface AccessResponseHooks<StrategyKeys, U extends User = User> {
  afterLoginSuccess?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    loggedInUser: U,
  ) => Promise<void> | void;

  afterScopeUpdate?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    scopeKey: string,
    account: Account,
    user: U,
  ) => Promise<void> | void;
}

export class AuthenticationService<
  StrategyKeys extends AllowedStrategyKeys,
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
  // eslint-disable-next-line unicorn/prefer-event-target
> extends EventEmitter {
  config: NodeConfig;

  strategies: Strategies<StrategyKeys>;

  userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>;

  constructor(
    config: NodeConfig,
    strategies: Strategies<StrategyKeys>,
    userAccountsService: UserAccountsService<StrategyKeys, U, USanitized>,
  ) {
    super();
    this.config = config;
    this.strategies = strategies;
    this.userAccountsService = userAccountsService;
  }

  generateAuthUrl<T extends StrategyKeys>(strategy: T, params: any): string {
    logger.debug("generateAuthUrl", { strategy, params });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2":
        return strategyInstance.oauth2.authorizationCode.authorizeURL(params);
      default:
        throw new Error("Invalid strategy");
    }
  }

  async getTokens(
    strategy: StrategyKeys,
    options: GetTokensOptions,
  ): Promise<Tokens> {
    logger.debug("getTokens", { strategy, options });
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2": {
        const result = await strategyInstance.oauth2.authorizationCode.getToken(
          {
            code: options.code,
            redirect_uri: options.redirectUri,
          },
        );
        if (!result) return result;
        const tokens = result.token;

        return {
          accessToken: tokens.access_token as string,
          refreshToken: tokens.refresh_token as string,
          tokenType: tokens.token_type as string,
          expiresIn: tokens.expires_in as number,
          expireDate: (() => {
            if (tokens.expires_in == null) return null;
            const d = new Date();
            d.setTime(d.getTime() + (tokens.expires_in as number) * 1000);
            return d;
          })(),
          idToken: tokens.id_token as string,
        };
        // return strategyInstance.accessToken.create(result);
      }

      default:
        throw new Error("Invalid stategy");
    }
  }

  async refreshToken(
    strategy: StrategyKeys,
    tokensParam: { refreshToken: string },
  ): Promise<Tokens> {
    logger.debug("refreshToken", { strategy });
    if (!tokensParam.refreshToken) {
      throw new Error("Missing refresh token");
    }
    const strategyInstance = this.strategies[strategy];
    switch (strategyInstance.type) {
      case "oauth2": {
        const token = strategyInstance.oauth2.clientCredentials.createToken({
          refresh_token: tokensParam.refreshToken,
        });
        const result = await token.refresh();
        const tokens = result.token;
        return {
          accessToken: tokens.access_token as string,
          tokenType: tokens.token_type as string,
          expiresIn: tokens.expires_in as number,
          expireDate: (() => {
            if (tokens.expires_in == null) return null;
            const d = new Date();
            d.setTime(d.getTime() + (tokens.expires_in as number) * 1000);
            return d;
          })(),
          idToken: tokens.id_token as string,
        };
      }

      default:
        throw new Error("Invalid stategy");
    }
  }

  redirectUri(ctx: Context, strategy: string): string {
    const host = `http${this.config.get("allowHttps") ? "s" : ""}://${
      ctx.request.host
    }`;
    return `${host}${ctx.urlGenerator("authResponse", {
      strategy,
    })}`;
  }

  async redirectAuthUrl(
    ctx: Context,
    strategy: StrategyKeys,
    {
      refreshToken,
      scopeKey,
      user,
      accountId,
    }: {
      refreshToken?: string | undefined;
      scopeKey?: string | undefined;
      user?: U;
      accountId?: AccountId;
    },
    params?: any,
  ): Promise<void> {
    logger.debug("redirectAuthUrl", { strategy, scopeKey, refreshToken });
    const state = await randomHex(8);
    const isLoginAccess = !scopeKey || scopeKey === "login";
    const scope = this.userAccountsService.getScope(
      strategy,
      scopeKey || "login",
      user,
      accountId,
    );

    if (!scope) {
      throw new Error("Invalid empty scope");
    }

    ctx.cookies.set(
      `auth_${strategy}_${state}`,
      JSON.stringify({
        scopeKey,
        scope,
        isLoginAccess,
      }),
      {
        maxAge: 10 * 60 * 1000,
        httpOnly: true,
        secure: this.config.get("allowHttps"),
      },
    );
    const redirectUri = this.generateAuthUrl(strategy, {
      redirect_uri: this.redirectUri(ctx, strategy),
      scope,
      state,
      access_type: refreshToken ? "offline" : "online",
      ...params,
    });

    ctx.redirect(redirectUri);
  }

  async accessResponse<StrategyKey extends StrategyKeys>(
    ctx: Context,
    strategy: StrategyKey,
    isLoggedIn: boolean,
    hooks: AccessResponseHooks<StrategyKeys, U>,
  ): Promise<U> {
    const errorParam = ctx.params.queryParam("error").notEmpty();
    if (errorParam.isValid()) {
      ctx.throw(errorParam.value, 403);
    }

    const code = ctx.validParams.queryParam("code").notEmpty().value;
    const state = ctx.validParams.queryParam("state").notEmpty().value;

    const cookieName = `auth_${strategy}_${state}`;
    const cookie = ctx.cookies.get(cookieName);
    ctx.cookies.set(cookieName, "", { expires: new Date(1) });
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

    const tokens: Tokens = await this.getTokens(strategy, {
      code,
      redirectUri: this.redirectUri(ctx, strategy),
    });

    if (parsedCookie.isLoginAccess) {
      const user = await this.userAccountsService.findOrCreateFromStrategy(
        strategy,
        tokens,
        parsedCookie.scope,
        parsedCookie.scopeKey,
      );

      if (hooks.afterLoginSuccess) {
        await hooks.afterLoginSuccess(strategy, user);
      }

      return user;
    }

    const loggedInUser = ctx.state.loggedInUser as U;
    const { account, user } = await this.userAccountsService.update(
      loggedInUser,
      strategy,
      tokens,
      parsedCookie.scope,
      parsedCookie.scopeKey,
    );

    if (hooks.afterScopeUpdate) {
      await hooks.afterScopeUpdate(
        strategy,
        parsedCookie.scopeKey,
        account,
        user,
      );
    }

    return loggedInUser;
  }

  refreshAccountTokens(user: U, account: Account): Promise<boolean> {
    if (
      account.tokenExpireDate &&
      account.tokenExpireDate.getTime() > Date.now()
    ) {
      return Promise.resolve(false);
    }
    return this.refreshToken(account.provider as StrategyKeys, {
      // accessToken: account.accessToken,
      refreshToken: account.refreshToken!,
    }).then((tokens: Tokens) => {
      if (!tokens) {
        // serviceGoogle.updateFields({ accessToken:null, refreshToken:null, status: .OUTDATED });
        return false;
      }
      account.accessToken = tokens.accessToken;
      account.tokenExpireDate = tokens.expireDate;
      return this.userAccountsService
        .updateAccount(user, account)
        .then(() => true);
    });
  }
}
