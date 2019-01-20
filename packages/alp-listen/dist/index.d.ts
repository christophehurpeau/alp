/// <reference types="node" />
import { Server, IncomingMessage, ServerResponse } from 'http';
import { Config } from 'alp-node-config';
declare type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;
export default function alpListen(config: Config, callback: RequestListener, dirname?: string): Promise<Server>;
export {};
//# sourceMappingURL=index.d.ts.map