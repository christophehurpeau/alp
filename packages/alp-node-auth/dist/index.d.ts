import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import { Strategies } from './services/authentification/AuthenticationService';
import { AuthController as AuthControllerType } from './createAuthController';
import { AuthRoutes as AuthRoutesType } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';
export { default as MongoUsersManager } from './MongoUsersManager';
export { authSocketIO } from './authSocketIO';
export { STATUSES } from './services/user/UserAccountsService';
export declare type AuthController = AuthControllerType;
export declare type AuthRoutes = AuthRoutesType;
export default function init<U extends User = User>({ usersManager, strategies, homeRouterKey, }: {
    homeRouterKey?: string;
    strategies: Strategies;
    usersManager: MongoUsersManager<U>;
}): (app: NodeApplication) => {
    routes: AuthRoutesType;
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map