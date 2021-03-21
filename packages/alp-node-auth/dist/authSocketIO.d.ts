import type { NodeApplication } from 'alp-types';
import type { Option } from 'cookies';
import type { User } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
export declare const authSocketIO: <U extends User = User>(app: NodeApplication, usersManager: MongoUsersManager<U, import("../types.d").UserSanitized>, io: any, options?: Pick<Option, "keys"> | undefined) => void;
//# sourceMappingURL=authSocketIO.d.ts.map