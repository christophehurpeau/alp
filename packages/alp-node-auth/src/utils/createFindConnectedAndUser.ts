import { promisify } from 'util';
import { verify } from 'jsonwebtoken';
import Logger from 'nightingale-logger';
import { User } from '../../types.d';
import MongoUsersManager from '../MongoUsersManager';

const verifyPromisified: any = promisify(verify);

const createDecodeJWT = (secretKey: string) => async (
  token: string,
  userAgent: string,
) => {
  const result = await verifyPromisified(token, secretKey, {
    algorithm: 'HS512',
    audience: userAgent,
  });
  return result?.connected;
};

export type FindConnectedAndUser<U> = (
  userAgent?: string,
  token?: string,
) => Promise<[null | string | number, null | undefined | U]>;

export const createFindConnectedAndUser = <U extends User>(
  secretKey: string,
  usersManager: MongoUsersManager<U>,
  logger: Logger,
): FindConnectedAndUser<U> => {
  const decodeJwt = createDecodeJWT(secretKey);

  const findConnectedAndUser: FindConnectedAndUser<U> = async (
    userAgent,
    token,
  ) => {
    if (!token || !userAgent) return [null, null];

    let connected;
    try {
      connected = await decodeJwt(token, userAgent);
    } catch (err) {
      logger.debug('failed to verify authentification', { err });
    }

    if (connected == null) return [null, null];

    const user = await usersManager.findConnected(connected);

    return [connected, user];
  };

  return findConnectedAndUser;
};
