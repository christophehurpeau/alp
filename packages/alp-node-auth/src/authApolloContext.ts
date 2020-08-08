import { IncomingMessage } from 'http';
import Logger from 'nightingale-logger';
import { NodeConfig } from 'alp-types';
import { User } from '../types.d';
import { getTokenFromRequest, COOKIE_NAME } from './utils/cookies';
import { createFindConnectedAndUser } from './utils/createFindConnectedAndUser';
import MongoUsersManager from './MongoUsersManager';

const logger = new Logger('alp:auth');

const getTokenFromReq = (
  req: IncomingMessage & { cookies?: any },
): string | undefined => {
  if (req.cookies) return req.cookies[COOKIE_NAME];
  return getTokenFromRequest(req);
};

/*
 * Not tested yet.
 * @internal
 */
export const createAuthApolloContext = <U extends User = User>(
  config: NodeConfig,
  usersManager: MongoUsersManager<U>,
) => {
  const findConnectedAndUser = createFindConnectedAndUser(
    config.get('authentication').get('secretKey'),
    usersManager,
    logger,
  );

  return async ({ req, connection }: { req: any; connection: any }) => {
    // if (connection) console.log(Object.keys(connection));
    if (connection?.user) {
      return { user: connection.user };
    }

    if (!req) return null;

    const token = getTokenFromReq(req);

    if (!token) return { user: undefined };

    const [, user] = await findConnectedAndUser(
      req.headers['user-agent'],
      token,
    );

    return { user };
  };
};
