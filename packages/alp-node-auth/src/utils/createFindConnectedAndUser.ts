import { promisify } from 'util';
import type {
  GetPublicKeyOrSecret,
  Secret,
  VerifyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import type { Logger } from 'nightingale-logger';
import type { User, UserSanitized } from '../../types.d';
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
>(jsonwebtoken.verify as Verify);

const createDecodeJWT =
  (secretKey: string) =>
  async (token: string, jwtAudience: string): Promise<string | undefined> => {
    const result = await verifyPromisified(token, secretKey, {
      algorithms: ['HS512'],
      audience: jwtAudience,
    });
    return (result as any)?.connected as string | undefined;
  };

export type FindConnectedAndUser<U extends User> = (
  jwtAudience?: string,
  token?: string,
) => Promise<[null | undefined | U['_id'], null | undefined | U]>;

export const createFindConnectedAndUser = <
  U extends User,
  USanitized extends UserSanitized,
>(
  secretKey: string,
  usersManager: MongoUsersManager<U, USanitized>,
  logger: Logger,
): FindConnectedAndUser<U> => {
  const decodeJwt = createDecodeJWT(secretKey);

  const findConnectedAndUser: FindConnectedAndUser<U> = async (
    jwtAudience,
    token,
  ) => {
    if (!token || !jwtAudience) return [null, null];

    let connected;
    try {
      connected = await decodeJwt(token, jwtAudience);
    } catch (err: unknown) {
      logger.debug('failed to verify authentification', { err });
    }

    if (connected == null) return [null, null];

    const user = await usersManager.findConnected(connected);

    return [connected, user];
  };

  return findConnectedAndUser;
};
