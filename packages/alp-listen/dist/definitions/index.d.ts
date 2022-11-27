/// <reference types="node" />
import type { Server, IncomingMessage, ServerResponse } from 'http';
import type { Config } from 'alp-node-config';
type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
export default function alpListen(config: Config, callback: RequestListener, dirname?: string): Promise<Server>;
export {};
//# sourceMappingURL=index.d.ts.map