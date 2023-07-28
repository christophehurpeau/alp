import type { IncomingMessage } from 'node:http';
import type { Option } from 'cookies';
import Cookies from 'cookies';

export const COOKIE_NAME_TOKEN = 'loggedInUserToken';
export const COOKIE_NAME_STATE = 'loggedInUserState';

export const getTokenFromRequest = (
  req: IncomingMessage,
  options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
): string | undefined => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return req.headers.authorization.slice('Bearer '.length);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const cookies = new Cookies(req, null as unknown as any, {
    ...options,
    secure: true,
  });

  return cookies.get(COOKIE_NAME_TOKEN);
};
