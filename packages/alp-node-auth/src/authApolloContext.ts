import type { IncomingMessage } from 'http';
import type { NodeConfig } from 'alp-types';
import Logger from 'nightingale-logger';
import type { User } from '../types.d';
import type MongoUsersManager from './MongoUsersManager';
import { getTokenFromRequest, COOKIE_NAME } from './utils/cookies';
import { createFindConnectedAndUser } from './utils/createFindConnectedAndUser';

const logger = new Logger('alp:auth');

const getTokenFromReq = (
  req: IncomingMessage & { cookies?: Record<string, string> },
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
): any => {
  const findConnectedAndUser = createFindConnectedAndUser(
    config
      .get<Map<string, string>>('authentication')
      .get('secretKey') as string,
    usersManager,
    logger,
  );

  return async ({ req, connection }: { req: any; connection: any }) => {
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
