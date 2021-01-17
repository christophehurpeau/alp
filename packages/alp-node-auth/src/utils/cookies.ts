import type { IncomingMessage } from 'http';
import type { Option } from 'cookies';
import Cookies from 'cookies';

export const COOKIE_NAME = 'connectedUser';

export const getTokenFromRequest = (
  req: IncomingMessage,
  options?: Pick<Option, Exclude<keyof Option, 'secure'>>,
): string | undefined => {
  const cookies = new Cookies(req, (null as unknown) as any, {
    ...options,
    secure: true,
  });

  return cookies.get(COOKIE_NAME);
};
