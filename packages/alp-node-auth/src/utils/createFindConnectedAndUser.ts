import { promisify } from 'util';
import type {
  GetPublicKeyOrSecret,
  Secret,
  VerifyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import { verify } from 'jsonwebtoken';
import type Logger from 'nightingale-logger';
import type { User } from '../../types.d';
import type MongoUsersManager from '../MongoUsersManager';

type Verify = (
  token: string,
  secretOrPublicKey: Secret | GetPublicKeyOrSecret,
  options?: VerifyOptions,
  callback?: VerifyCallback,
) => void;

const verifyPromisified = promisify<
  Parameters<Verify>[0],
  Parameters<Verify>[1],
  Parameters<Verify>[2],
  Parameters<VerifyCallback>[1]
>(verify as Verify);

const createDecodeJWT = (secretKey: string) => async (
  token: string,
  userAgent: string,
): Promise<string | undefined> => {
  const result = await verifyPromisified(token, secretKey, {
    algorithms: ['HS512'],
    audience: userAgent,
  });
  return (result as any)?.connected as string | undefined;
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
    } catch (err: unknown) {
      logger.debug('failed to verify authentification', { err });
    }

    if (connected == null) return [null, null];

    const user = await usersManager.findConnected(connected);

    return [connected, user];
  };

  return findConnectedAndUser;
};
