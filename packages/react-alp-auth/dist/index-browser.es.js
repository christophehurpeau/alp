import { getServerCookieValue } from 'alp-nextjs';
import BrowserCookies from 'js-cookie';

const COOKIE_NAME_STATE = 'loggedInUserState';
const parseCookie = stateValue => {
  return stateValue ? JSON.parse(stateValue) : null;
};
const browserStateValueParsed = parseCookie(BrowserCookies.get("loggedInUserState"));
function useLoggedInUserStateBrowser() {
  return {
    isLoggedIn: !!browserStateValueParsed,
    loggedInUserId: browserStateValueParsed == null ? void 0 : browserStateValueParsed.loggedInUserId,
    expiresIn: browserStateValueParsed == null ? void 0 : browserStateValueParsed.expiresIn
  };
}
const useLoggedInUserState = useLoggedInUserStateBrowser;
const getServerAuthCookieValue = ctx => getServerCookieValue(ctx, COOKIE_NAME_STATE);

export { getServerAuthCookieValue, useLoggedInUserState };
//# sourceMappingURL=index-browser.es.js.map
