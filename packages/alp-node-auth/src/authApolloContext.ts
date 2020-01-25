import Logger from 'nightingale-logger';
import { NodeConfig } from 'alp-types';
import { User } from '../types.d';
import { createDecodeJWT } from './utils/createDecodeJWT';
import MongoUsersManager from './MongoUsersManager';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

export const createAuthApolloContext = <U extends User = User>(
  config: NodeConfig,
  usersManager: MongoUsersManager<U>,
) => {
  const decodeJwt = createDecodeJWT(
    config.get('authentication').get('secretKey'),
  );

  return async ({ req }: { req: any }) => {
    const token = req.cookies[COOKIE_NAME];
    logger.debug('middleware websocket', { token });

    if (!token) return { user: undefined };

    let connected;
    try {
      connected = await decodeJwt(token, req.headers['user-agent']);
    } catch (err) {
      logger.info('failed to verify authentication', { err });
      return { user: undefined };
    }
    logger.debug('middleware websocket', { connected });

    if (!connected) return { user: undefined };

    const user = await usersManager.findConnected(connected);

    return { user };
  };
};
