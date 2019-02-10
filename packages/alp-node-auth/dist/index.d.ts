import { NodeApplication } from 'alp-types';
import { Option } from 'cookies';
import { User } from '../types.d';
import { Strategies } from './services/authentification/AuthenticationService';
import { AuthController as AuthControllerType } from './createAuthController';
import { AuthRoutesType } from './createRoutes';
import MongoUsersManager from './MongoUsersManager';
export { default as MongoUsersManager } from './MongoUsersManager';
export { STATUSES } from './services/user/UserAccountsService';
interface ExtendedNodeApplication extends NodeApplication {
    websocket?: any;
}
export declare type AuthController = AuthControllerType;
export declare type AuthRoutes = AuthRoutesType;
export default function init<U extends User = User>({ usersManager, strategies, homeRouterKey, }: {
    homeRouterKey?: string;
    strategies: Strategies;
    usersManager: MongoUsersManager<U>;
}): (app: ExtendedNodeApplication, options?: Pick<Option, "keys"> | undefined) => {
    routes: import("../../../../../../../../Users/chris/Work/alp/alp/packages/alp-node-auth/src/createRoutes").AuthRoutes;
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map