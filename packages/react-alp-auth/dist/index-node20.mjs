import { getServerCookieValue } from 'alp-nextjs';
import BrowserCookies from 'js-cookie';

const COOKIE_NAME_STATE = "loggedInUserState";
const parseCookie = stateValue => {
  return stateValue ? JSON.parse(stateValue) : null;
};
parseCookie(BrowserCookies.get("loggedInUserState"));
function useLoggedInUserStateServer(serverCookieValue) {
  if (serverCookieValue) {
    const serverStateValueParsed = parseCookie(serverCookieValue);
    return {
      isLoggedIn: !!serverStateValueParsed,
      loggedInUserId: serverStateValueParsed?.loggedInUserId,
      expiresIn: serverStateValueParsed?.expiresIn
    };
  }
  return {
    isLoggedIn: false,
    loggedInUserId: undefined,
    expiresIn: undefined
  };
}
const useLoggedInUserState = useLoggedInUserStateServer;
const getServerAuthCookieValue = ctx => getServerCookieValue(ctx, COOKIE_NAME_STATE);

export { getServerAuthCookieValue, useLoggedInUserState };
//# sourceMappingURL=index-node20.mjs.map
