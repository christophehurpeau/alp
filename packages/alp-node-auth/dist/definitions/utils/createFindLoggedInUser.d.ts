import type { Logger } from "nightingale-logger";
import type MongoUsersManager from "../MongoUsersManager";
import type { User, UserSanitized } from "../types";
export type FindLoggedInUser<U extends User> = (jwtAudience?: string, token?: string) => Promise<[U["_id"] | null | undefined, U | null | undefined]>;
export declare const createFindLoggedInUser: <U extends User, USanitized extends UserSanitized>(secretKey: string, usersManager: MongoUsersManager<U, USanitized>, logger: Logger) => FindLoggedInUser<U>;
//# sourceMappingURL=createFindLoggedInUser.d.ts.map