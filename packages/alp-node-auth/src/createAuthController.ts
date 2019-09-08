import { Context } from 'alp-types';
import AuthenticationService, {
  AccessResponseHooks,
} from './services/authentification/AuthenticationService';
import MongoUsersManager from './MongoUsersManager';
import {
  AllowedStrategyKeys,
  AllowedMapParamsStrategy,
} from './services/authentification/types';

export interface CreateAuthControllerParams<
  StrategyKeys extends AllowedStrategyKeys
> {
  authenticationService: AuthenticationService<StrategyKeys>;
  homeRouterKey?: string;
  usersManager: MongoUsersManager;
  defaultStrategy?: StrategyKeys;
  authHooks?: AuthHooks<StrategyKeys>;
}

export interface AuthController {
  login(ctx: Context): Promise<void>;
  addScope(ctx: Context): Promise<void>;
  loginResponse(ctx: Context): Promise<void>;
  logout(ctx: Context): Promise<void>;
}

type OptionalRecord<K extends keyof any, T> = { [P in K]?: T };

export interface AuthHooks<StrategyKeys extends AllowedStrategyKeys>
  extends AccessResponseHooks<StrategyKeys> {
  paramsForLogin?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    ctx: Context,
  ) =>
    | void
    | Promise<void>
    | OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>
    | Promise<OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>>;
}

export function createAuthController<StrategyKeys extends AllowedStrategyKeys>({
  usersManager,
  authenticationService,
  homeRouterKey = '/',
  defaultStrategy,
  authHooks = {},
}: CreateAuthControllerParams<StrategyKeys>): AuthController {
  return {
    async login(ctx: Context): Promise<void> {
      const strategy = ctx.namedParam('strategy') || defaultStrategy;
      if (!strategy) throw new Error('Strategy missing');
      const params =
        (authHooks.paramsForLogin &&
          (await authHooks.paramsForLogin(strategy, ctx))) ||
        {};
      await authenticationService.redirectAuthUrl(ctx, strategy, {}, params);
    },

    async addScope(ctx: Context): Promise<void> {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy') || defaultStrategy;
      if (!strategy) throw new Error('Strategy missing');
      const scopeKey = ctx.namedParam('scopeKey');
      if (!scopeKey) throw new Error('Scope missing');
      await authenticationService.redirectAuthUrl(ctx, strategy, { scopeKey });
    },

    async loginResponse(ctx: Context): Promise<void> {
      if (ctx.state.connected) {
        ctx.redirect(ctx.urlGenerator(homeRouterKey));
      }

      const strategy = ctx.namedParam('strategy');
      ctx.assert(strategy);

      const connectedUser = await authenticationService.accessResponse(
        ctx,
        strategy,
        ctx.state.connected,
        {
          afterLoginSuccess: authHooks.afterLoginSuccess,
          afterScopeUpdate: authHooks.afterScopeUpdate,
        },
      );
      const keyPath: string = usersManager.store.keyPath;
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      ctx.state.connected = connectedUser;
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },

    async logout(ctx: Context): Promise<void> {
      ctx.logout();
      await ctx.redirect(ctx.urlGenerator(homeRouterKey));
    },
  };
}
