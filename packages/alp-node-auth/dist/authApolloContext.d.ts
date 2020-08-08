import { NodeConfig } from 'alp-types';
import { User } from '../types.d';
import MongoUsersManager from './MongoUsersManager';
export declare const createAuthApolloContext: <U extends User = User>(config: NodeConfig, usersManager: MongoUsersManager<U, import("../types").UserSanitized>) => ({ req, connection }: {
    req: any;
    connection: any;
}) => Promise<{
    user: any;
} | null>;
//# sourceMappingURL=authApolloContext.d.ts.map