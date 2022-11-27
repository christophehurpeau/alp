import type { Context } from 'alp-node';
import 'alp-router';
import type { User, UserSanitized } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import type {
  AuthenticationService,
  AccessResponseHooks,
} from './services/authentification/AuthenticationService';
import type {
  AllowedStrategyKeys,
  AllowedMapParamsStrategy,
} from './services/authentification/types';

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
  login: (ctx: Context) => Promise<void>;
  addScope: (ctx: Context) => Promise<void>;
  response: (ctx: Context) => Promise<void>;
  logout: (ctx: Context) => Promise<void>;
}

type OptionalRecord<K extends keyof any, T> = { [P in K]?: T };

export interface AuthHooks<StrategyKeys extends AllowedStrategyKeys>
  extends AccessResponseHooks<StrategyKeys> {
  paramsForLogin?: <StrategyKey extends StrategyKeys>(
    strategy: StrategyKey,
    ctx: Context,
  ) => // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  | void
    | Promise<void>
    | OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>
    | Promise<OptionalRecord<AllowedMapParamsStrategy[StrategyKey], any>>;
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
      if (!ctx.state.connected) {
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

      const connectedUser = await authenticationService.accessResponse(
        ctx,
        strategy,
        ctx.state.connected as boolean | undefined,
        {
          afterLoginSuccess: authHooks.afterLoginSuccess,
          afterScopeUpdate: authHooks.afterScopeUpdate,
        },
      );
      const keyPath = usersManager.store.keyPath;
      await ctx.setConnected(connectedUser[keyPath], connectedUser);
      await ctx.redirectTo(homeRouterKey);
    },

    async logout(ctx: Context): Promise<void> {
      ctx.logout();
      await ctx.redirectTo(homeRouterKey);
    },
  };
}
