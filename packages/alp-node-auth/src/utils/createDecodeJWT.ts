import { promisify } from 'util';
import { verify } from 'jsonwebtoken';

const verifyPromisified: any = promisify(verify);

export const createDecodeJWT = (secretKey: string) => async (
  token: string,
  userAgent: string,
) => {
  const result = await verifyPromisified(token, secretKey, {
    algorithm: 'HS512',
    audience: userAgent,
  });
  return result && result.connected;
};
