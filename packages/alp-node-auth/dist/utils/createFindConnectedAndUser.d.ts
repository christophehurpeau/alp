import type Logger from 'nightingale-logger';
import type { User } from '../../types.d';
import type MongoUsersManager from '../MongoUsersManager';
export declare type FindConnectedAndUser<U> = (userAgent?: string, token?: string) => Promise<[null | string | number, null | undefined | U]>;
export declare const createFindConnectedAndUser: <U extends User>(secretKey: string, usersManager: MongoUsersManager<U, import("../../types").UserSanitized>, logger: Logger) => FindConnectedAndUser<U>;
//# sourceMappingURL=createFindConnectedAndUser.d.ts.map