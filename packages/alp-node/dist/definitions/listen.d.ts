import type { IncomingMessage, Server, ServerResponse } from "node:http";
import type { Config } from "./config";
type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
export default function alpListen(config: Config, callback: RequestListener, dirname?: string): Promise<Server>;
export {};
//# sourceMappingURL=listen.d.ts.map