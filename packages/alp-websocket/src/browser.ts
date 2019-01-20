/* eslint-disable no-use-before-define, typescript/no-use-before-define, max-lines */
import socketio from 'socket.io-client';
import Logger from 'nightingale-logger';
import { BrowserApplication } from 'alp-types';

const logger = new Logger('alp:websocket');

type Socket = ReturnType<typeof socketio>;

let socket: Socket | undefined;
let successfulConnection: boolean | null = null;
let connected = false;

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

export const websocket: Websocket = {
  get connected() {
    return connected;
  },
  on,
  off,
  emit,
  isConnected,
  isDisconnected,
  socket,
};

function start(app: BrowserApplication, namespaceName: string) {
  const { config, context } = app;

  if (socket) {
    throw new Error('WebSocket already started');
  }

  const webSocketConfig = config.get('webSocket') || config.get('websocket');

  if (!webSocketConfig) {
    throw new Error('Missing config webSocket');
  }

  if (!webSocketConfig.has('port')) {
    throw new Error('Missing config webSocket.port');
  }

  const secure = webSocketConfig.get('secure');
  const port = webSocketConfig.get('port');

  socket = socketio(
    `http${secure ? 's' : ''}://${
      window.location.hostname
    }:${port}/${namespaceName}`,
    {
      reconnectionDelay: 500,
      reconnectionDelayMax: 2500,
      timeout: 4000,
      transports: ['websocket'],
    },
  );

  const callbackFirstConnectionError = () => {
    successfulConnection = false;
  };

  socket.on('connect_error', callbackFirstConnectionError);

  socket.on('connect', () => {
    (socket as Socket).off('connect_error', callbackFirstConnectionError);
    logger.success('connected');
    successfulConnection = true;
    connected = true;
  });

  socket.on('reconnect', () => {
    logger.success('reconnected');
    connected = true;
  });

  socket.on('disconnect', () => {
    logger.warn('disconnected');
    connected = false;
  });

  socket.on('hello', ({ version }: { version: string }) => {
    if (version !== window.__VERSION__) {
      // eslint-disable-next-line no-alert
      if (
        process.env.NODE_ENV === 'production' &&
        window.confirm(context.t('newversion'))
      ) {
        return window.location.reload(true);
      } else {
        console.warn('Version mismatch', {
          serverVersion: version,
          clientVersion: window.__VERSION__,
        });
      }
    }
  });

  socket.on('redux:action', (action: any) => {
    logger.debug('dispatch action from websocket', action);
    // @ts-ignore
    app.store.dispatch(action);
  });

  return socket;
}

function emit(event: string, ...args: Array<any>): Promise<any> {
  if (!socket) throw new Error('Cannot call emit() before start()');
  logger.debug('emit', { args });
  return new Promise((resolve, reject) => {
    const resolved = setTimeout(() => {
      logger.warn('websocket emit timeout', { args });
      reject(new Error('websocket response timeout'));
    }, 10000);

    (socket as Socket).emit(
      event,
      ...args,
      (error: Error | string | null, result: any) => {
        clearTimeout(resolved);
        if (error != null) {
          return reject(typeof error === 'string' ? new Error(error) : error);
        }
        resolve(result);
      },
    );
  });
}

function on<T extends Function>(event: string, handler: T): T {
  if (!socket) throw new Error('Cannot call on() before start()');
  socket.on(event, handler);
  return handler;
}

function off(event: string, handler: Function): void {
  if (!socket) throw new Error('Cannot call off() before start()');
  socket.off(event, handler);
}

function isConnected(): boolean {
  // socket.connected is not updated after reconnect event
  return !!socket && connected;
}

function isDisconnected(): boolean {
  return !!successfulConnection && !isConnected();
}

export default function alpWebsocket(
  app: BrowserApplication,
  namespaceName: string = '',
) {
  start(app, namespaceName);
  app.websocket = websocket;
  websocket.socket = socket;
  return socket;
}
