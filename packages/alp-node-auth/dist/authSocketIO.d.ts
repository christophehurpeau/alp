import Cookies from 'cookies';
import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import MongoUsersManager from './MongoUsersManager';
export declare const authSocketIO: <U extends User = User>(app: NodeApplication, usersManager: MongoUsersManager<U, import("../types").UserSanitized>, io: any, options?: Pick<Cookies.Option, "keys"> | undefined) => void;
//# sourceMappingURL=authSocketIO.d.ts.map