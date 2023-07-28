import type { NodeApplication } from 'alp-types';
import { Logger } from 'nightingale-logger';
import type MongoUsersManager from './MongoUsersManager';
import type { User } from './types';
import { getTokenFromRequest } from './utils/cookies';
import { createFindLoggedInUser } from './utils/createFindLoggedInUser';

const logger = new Logger('alp:auth');

export const authSocketIO = <U extends User = User>(
  app: NodeApplication,
  usersManager: MongoUsersManager<U>,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  io: any,
  jwtAudience?: string,
): void => {
  const findLoggedInUser = createFindLoggedInUser(
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

    const [loggedInUserId, loggedInUser] = await findLoggedInUser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jwtAudience || handshakeData.headers['user-agent'],
      token,
    );

    if (!loggedInUserId || !loggedInUser) return next();

    socket.user = loggedInUser;
    users.set(socket.client.id, loggedInUser);

    socket.on('disconnected', () => users.delete(socket.client.id));

    await next();
  });
};
