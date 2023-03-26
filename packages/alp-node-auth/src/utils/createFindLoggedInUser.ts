import { promisify } from 'util';
import type {
  GetPublicKeyOrSecret,
  Secret,
  VerifyCallback,
  VerifyOptions,
} from 'jsonwebtoken';
import jsonwebtoken from 'jsonwebtoken';
import type { Logger } from 'nightingale-logger';
import type { User, UserSanitized } from '../../types';
import type MongoUsersManager from '../MongoUsersManager';

type Verify = (
  token: string,
  secretOrPublicKey: GetPublicKeyOrSecret | Secret,
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
    return (result as any)?.loggedInUserId as string | undefined;
  };

export type FindLoggedInUser<U extends User> = (
  jwtAudience?: string,
  token?: string,
) => Promise<[U['_id'] | null | undefined, U | null | undefined]>;

export const createFindLoggedInUser = <
  U extends User,
  USanitized extends UserSanitized,
>(
  secretKey: string,
  usersManager: MongoUsersManager<U, USanitized>,
  logger: Logger,
): FindLoggedInUser<U> => {
  const decodeJwt = createDecodeJWT(secretKey);

  const findLoggedInUser: FindLoggedInUser<U> = async (jwtAudience, token) => {
    if (!token || !jwtAudience) return [null, null];

    let loggedInUserId;
    try {
      loggedInUserId = await decodeJwt(token, jwtAudience);
    } catch (err: unknown) {
      logger.debug('failed to verify authentification', { err });
    }

    if (loggedInUserId == null) return [null, null];

    const loggedInUser = await usersManager.findById(loggedInUserId);

    if (!loggedInUser) return [null, null];

    return [loggedInUserId, loggedInUser];
  };

  return findLoggedInUser;
};
