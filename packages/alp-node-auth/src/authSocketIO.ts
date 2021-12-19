import type { NodeApplication } from 'alp-types';
import type { Option } from 'cookies';
import Logger from 'nightingale-logger';
import type { User } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import { getTokenFromRequest } from './utils/cookies';
import { createFindConnectedAndUser } from './utils/createFindConnectedAndUser';

const logger = new Logger('alp:auth');

export const authSocketIO = <U extends User = User>(
  app: NodeApplication,
  usersManager: MongoUsersManager<U>,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  io: any,
  options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
): void => {
  const findConnectedAndUser = createFindConnectedAndUser(
    app.config.get<Map<string, string>>('authentication').get('secretKey')!,
    usersManager,
    logger,
  );

  const users = new Map();
  io.users = users;

  io.use(async (socket: any, next: any) => {
    const handshakeData = socket.request;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = getTokenFromRequest(handshakeData);

    if (!token) return next();

    const [connected, user] = await findConnectedAndUser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      handshakeData.headers['user-agent'],
      token,
    );

    if (!connected || !user) return next();

    socket.user = user;
    users.set(socket.client.id, user);

    socket.on('disconnected', () => users.delete(socket.client.id));

    await next();
  });
};
