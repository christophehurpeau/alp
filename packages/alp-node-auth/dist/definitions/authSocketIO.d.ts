import type { NodeApplication } from 'alp-node';
import type MongoUsersManager from './MongoUsersManager';
import type { User } from './types';
export declare const authSocketIO: <U extends User = User>(app: NodeApplication, usersManager: MongoUsersManager<U, import("./types").UserSanitized>, io: any, jwtAudience?: string) => void;
//# sourceMappingURL=authSocketIO.d.ts.map