import { NodeApplication } from 'alp-types';
import { Option } from 'cookies';
import { Strategies } from './services/authentification/AuthenticationService';
export { default as MongoUsersManager } from './MongoUsersManager';
interface ExtendedNodeApplication extends NodeApplication {
    websocket?: any;
}
export default function init({ usersManager, strategies, homeRouterKey, }: {
    homeRouterKey?: string;
    strategies: Strategies;
    usersManager: any;
}): (app: ExtendedNodeApplication, options?: Pick<Option, "keys"> | undefined) => {
    routes: {
        login: (string | ((segment: any) => void))[];
        logout: (string | ((ctx: any) => Promise<void>))[];
    };
    middleware: (ctx: any, next: any) => Promise<any>;
};
//# sourceMappingURL=index.d.ts.map