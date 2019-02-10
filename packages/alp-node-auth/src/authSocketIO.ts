import Cookies, { Option } from 'cookies';
import Logger from 'nightingale-logger';
import { NodeApplication } from 'alp-types';
import { User } from '../types.d';
import { createDecodeJWT } from './utils/createDecodeJWT';
import MongoUsersManager from './MongoUsersManager';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

export const authSocketIO = <U extends User = User>(
  app: NodeApplication,
  usersManager: MongoUsersManager<U>,
  io: any,
  options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
) => {
  const decodeJwt = createDecodeJWT(
    app.config.get('authentication').get('secretKey'),
  );

  const users = new Map();
  io.users = users;

  io.use(async (socket: any, next: any) => {
    const handshakeData = socket.request;
    const cookies = new Cookies(handshakeData, (null as unknown) as any, {
      ...options,
      secure: true,
    });
    const token = cookies.get(COOKIE_NAME);
    logger.debug('middleware websocket', { token });

    if (!token) return next();

    let connected;
    try {
      connected = await decodeJwt(token, handshakeData.headers['user-agent']);
    } catch (err) {
      logger.info('failed to verify authentication', { err });
      return next();
    }
    logger.debug('middleware websocket', { connected });

    if (!connected) return next();

    const user = await usersManager.findConnected(connected);

    if (!user) return next();

    socket.user = user;
    users.set(socket.client.id, user);

    socket.on('disconnected', () => users.delete(socket.client.id));

    await next();
  });
};
