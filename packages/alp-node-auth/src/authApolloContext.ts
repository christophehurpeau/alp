import Cookies, { Option } from 'cookies';
import Logger from 'nightingale-logger';
import { NodeConfig } from 'alp-types';
import { User } from '../types.d';
import { createDecodeJWT } from './utils/createDecodeJWT';
import MongoUsersManager from './MongoUsersManager';

const COOKIE_NAME = 'connectedUser';
const logger = new Logger('alp:auth');

const getTokenFromReq = (
  req: any,
  options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
): string | undefined => {
  if (req.cookies) return req.cookies[COOKIE_NAME];
  const cookies = new Cookies(req, (null as unknown) as any, {
    ...options,
    secure: true,
  });

  return cookies.get(COOKIE_NAME);
};

export const createAuthApolloContext = <U extends User = User>(
  config: NodeConfig,
  usersManager: MongoUsersManager<U>,
) => {
  const decodeJwt = createDecodeJWT(
    config.get('authentication').get('secretKey'),
  );

  return async ({ req, connection }: { req: any; connection: any }) => {
    if (connection) console.log(Object.keys(connection));
    if (connection?.user) {
      return { user: connection.user };
    }

    if (!req) return null;

    const token = getTokenFromReq(req);
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
