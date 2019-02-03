import { NodeApplication } from 'alp-types';
import { Option } from 'cookies';
import { Strategies } from './services/authentification/AuthenticationService';
import { AuthController } from './createAuthController';
import MongoUsersManager from './MongoUsersManager';
export { default as MongoUsersManager } from './MongoUsersManager';
export { STATUSES } from './services/user/UserAccountsService';
interface ExtendedNodeApplication extends NodeApplication {
    websocket?: any;
}
export interface AuthRoutes {
    login: [string, (segment: any) => void];
    logout: [string, AuthController['logout']];
}
export default function init({ usersManager, strategies, homeRouterKey, }: {
    homeRouterKey?: string;
    strategies: Strategies;
    usersManager: MongoUsersManager;
}): (app: ExtendedNodeApplication, options?: Pick<Option, "keys"> | undefined) => {
    routes: AuthRoutes;
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map