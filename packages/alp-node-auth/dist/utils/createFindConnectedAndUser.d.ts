import type Logger from 'nightingale-logger';
import type { User, UserSanitized } from '../../types.d';
import type MongoUsersManager from '../MongoUsersManager';
export declare type FindConnectedAndUser<U extends User> = (userAgent?: string, token?: string) => Promise<[null | undefined | U['_id'], null | undefined | U]>;
export declare const createFindConnectedAndUser: <U extends User, USanitized extends UserSanitized>(secretKey: string, usersManager: MongoUsersManager<U, USanitized>, logger: Logger) => FindConnectedAndUser<U>;
//# sourceMappingURL=createFindConnectedAndUser.d.ts.map