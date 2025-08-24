import BrowserCookies from "js-cookie";
import { COOKIE_NAME_STATE } from "./config";
import { parseCookie } from "./parseCookie";

export interface LoggedInUserState {
  isLoggedIn: boolean;
  loggedInUserId: string | undefined;
  expiresIn: number | undefined;
}

const browserStateValueParsed = parseCookie(
  BrowserCookies.get(COOKIE_NAME_STATE),
);

export function useLoggedInUserState(
  serverCookieValue?: string | null,
): LoggedInUserState {
  return {
    isLoggedIn: !!browserStateValueParsed,
    loggedInUserId: browserStateValueParsed?.loggedInUserId,
    expiresIn: browserStateValueParsed?.expiresIn,
  };
}
