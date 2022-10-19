import type { IncomingMessage } from 'http';
import type { Option } from 'cookies';
export declare const COOKIE_NAME = "connectedUser";
export declare const getTokenFromRequest: (req: IncomingMessage, options?: Pick<Option, Exclude<keyof Option, 'secure'>>) => string | undefined;
//# sourceMappingURL=cookies.d.ts.map