import { IncomingMessage } from 'http';
import Cookies from 'cookies';
export declare const COOKIE_NAME = "connectedUser";
export declare const getTokenFromRequest: (req: IncomingMessage, options?: Pick<Cookies.Option, "keys"> | undefined) => string | undefined;
//# sourceMappingURL=cookies.d.ts.map