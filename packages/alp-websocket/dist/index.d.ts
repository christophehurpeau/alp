import { Server, Socket } from 'socket.io';
import { NodeApplication } from 'alp-types';
interface NodeApplicationWithWebsocket extends NodeApplication {
    websocket: Server;
}
export declare function close(): void;
/**
 * @param {Koa|AlpNodeApp} app
 * @param {string} [dirname] for tls, dirname of server.key server.crt. If undefined: app.certPath
 */
export default function alpWebsocket(app: NodeApplication, dirname?: string): NodeApplicationWithWebsocket;
export declare function subscribe(socket: Socket, name: string, callbackOnSubscribe: () => void, callbackOnUnsubscribe: () => void): void;
export {};
//# sourceMappingURL=index.d.ts.map