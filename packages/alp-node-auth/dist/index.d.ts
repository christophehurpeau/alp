import { NodeApplication } from 'alp-types';
import { Option } from 'cookies';
import { Strategies } from './services/authentification/AuthenticationService';
import MongoUsersManager from './MongoUsersManager';
export { default as MongoUsersManager } from './MongoUsersManager';
export { STATUSES } from './services/user/UserAccountsService';
interface ExtendedNodeApplication extends NodeApplication {
    websocket?: any;
}
export default function init({ usersManager, strategies, homeRouterKey, }: {
    homeRouterKey?: string;
    strategies: Strategies;
    usersManager: MongoUsersManager;
}): (app: ExtendedNodeApplication, options?: Pick<Option, "keys"> | undefined) => {
    routes: {
        login: (string | ((segment: any) => void))[];
        logout: (string | ((ctx: any) => Promise<void>))[];
    };
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map