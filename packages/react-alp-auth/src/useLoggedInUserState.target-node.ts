import { parseCookie } from "./parseCookie";
import type { LoggedInUserState } from "./useLoggedInUserState";

export function useLoggedInUserState(
  serverCookieValue?: string | null,
): LoggedInUserState {
  if (serverCookieValue) {
    const serverStateValueParsed = parseCookie(serverCookieValue);
    return {
      isLoggedIn: !!serverStateValueParsed,
      loggedInUserId: serverStateValueParsed?.loggedInUserId,
      expiresIn: serverStateValueParsed?.expiresIn,
    };
  }
  return {
    isLoggedIn: false,
    loggedInUserId: undefined,
    expiresIn: undefined,
  };
}
