/// <reference types="node" />
import type { IncomingMessage } from 'node:http';
import type { Option } from 'cookies';
export declare const COOKIE_NAME_TOKEN = "loggedInUserToken";
export declare const COOKIE_NAME_STATE = "loggedInUserState";
export declare const getTokenFromRequest: (req: IncomingMessage, options?: Pick<Option, Exclude<keyof Option, 'secure'>>) => string | undefined;
//# sourceMappingURL=cookies.d.ts.map