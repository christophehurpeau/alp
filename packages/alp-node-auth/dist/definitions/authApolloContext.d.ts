import type { NodeConfig } from 'alp-node';
import type MongoUsersManager from './MongoUsersManager';
import type { User } from './types';
export declare const createAuthApolloContext: <U extends User = User>(config: NodeConfig, usersManager: MongoUsersManager<U>) => any;
//# sourceMappingURL=authApolloContext.d.ts.map