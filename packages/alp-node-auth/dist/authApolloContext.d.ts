import type { NodeConfig } from 'alp-types';
import type { User } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
export declare const createAuthApolloContext: <U extends User = User>(config: NodeConfig, usersManager: MongoUsersManager<U, import("../types").UserSanitized>) => any;
//# sourceMappingURL=authApolloContext.d.ts.map