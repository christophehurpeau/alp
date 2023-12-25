import type { AlpRouteRef } from 'alp-router';
import type { Context } from 'alp-types';
import type MongoUsersManager from './MongoUsersManager';
import type {
  AuthenticationService,
  AccessResponseHooks,
} from './services/authentification/AuthenticationService';
import type {
  AllowedStrategyKeys,
  AllowedMapParamsStrategy,
} from './services/authentification/types';
import type { User, UserSanitized } from './types';

export interface CreateAuthControllerParams<
  StrategyKeys extends AllowedStrategyKeys,
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
> {
  authenticationService: AuthenticationService<StrategyKeys, U, UserSanitized>;
  homeRouterKey?: string;
  usersManager: MongoUsersManager<U, USanitized>;
  defaultStrategy?: StrategyKeys;
  authHooks?: AuthHooks<StrategyKeys>;
}

export interface AuthController {
  login: AlpRouteRef;
  addScope: AlpRouteRef;
  response: AlpRouteRef;
  logout: AlpRouteRef;
}

type OptionalRecord<K extends keyof any, T> = { [P in K]?: T };

export interface AuthHooks<StrategyKeys extends AllowedStrategyKeys>
  extends AccessResponseHooks<StrategyKeys> {
  paramsForLogin?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    ctx: Context,
  ) =>
    | OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>
    | Promise<OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>>
    | Promise<void>
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    | void;
}

export function createAuthController<
  StrategyKeys extends AllowedStrategyKeys,
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
>({
  usersManager,
  authenticationService,
  homeRouterKey = '/',
  defaultStrategy,
  authHooks = {},
}: CreateAuthControllerParams<StrategyKeys, U, USanitized>): AuthController {
  return {
    async login(ctx: Context): Promise<void> {
      const strategy: StrategyKeys = (ctx.namedParam('strategy') ||
        defaultStrategy) as StrategyKeys;
      if (!strategy) throw new Error('Strategy missing');
      const params =
        (authHooks.paramsForLogin &&
          (await authHooks.paramsForLogin(strategy, ctx))) ||
        {};
      await authenticationService.redirectAuthUrl(ctx, strategy, {}, params);
    },

    /**
     * Add scope in existing
     * The user must already be connected
     */
    async addScope(ctx: Context): Promise<void> {
      if (!ctx.state.loggedInUser) {
        await ctx.redirectTo(homeRouterKey);
        return;
      }

      const strategy: StrategyKeys = (ctx.namedParam('strategy') ||
        defaultStrategy) as StrategyKeys;
      if (!strategy) throw new Error('Strategy missing');
      const scopeKey = ctx.namedParam('scopeKey');
      if (!scopeKey) throw new Error('Scope missing');
      await authenticationService.redirectAuthUrl(ctx, strategy, { scopeKey });
    },

    async response(ctx: Context): Promise<void> {
      const strategy: StrategyKeys = ctx.namedParam('strategy') as StrategyKeys;
      ctx.assert(strategy);

      const loggedInUser = await authenticationService.accessResponse(
        ctx,
        strategy,
        !!ctx.state.loggedInUser,
        {
          afterLoginSuccess: authHooks.afterLoginSuccess,
          afterScopeUpdate: authHooks.afterScopeUpdate,
        },
      );
      const keyPath = usersManager.store.keyPath;
      await ctx.setLoggedIn(loggedInUser[keyPath], loggedInUser);
      await ctx.redirectTo(homeRouterKey);
    },

    async logout(ctx: Context): Promise<void> {
      ctx.logout();
      await ctx.redirectTo(homeRouterKey);
    },
  };
}
