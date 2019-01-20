import socketio from 'socket.io-client';
import { BrowserApplication } from 'alp-types';
type Socket = ReturnType<typeof socketio>;
interface Websocket {
    connected: boolean;
    isConnected: () => boolean;
    isDisconnected: () => boolean;
    on: typeof on;
    off: typeof off;
    emit: typeof emit;
    socket?: Socket;
}
declare module 'alp-types' {
    interface BrowserApplication {
        websocket: Websocket;
    }
}
declare global {
    interface Window {
        __VERSION__: string;
    }
}
export declare const websocket: Websocket;
declare function emit(event: string, ...args: Array<any>): Promise<any>;
declare function on<T extends Function>(event: string, handler: T): T;
declare function off(event: string, handler: Function): void;
export default function alpWebsocket(app: BrowserApplication, namespaceName?: string): SocketIOClient.Socket | undefined;
export {};
//# sourceMappingURL=browser.d.ts.map