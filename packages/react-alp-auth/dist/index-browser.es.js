import { getServerCookieValue } from 'alp-nextjs';
import BrowserCookies from 'js-cookie';

var COOKIE_NAME_STATE = 'loggedInUserState';
var parseCookie = function parseCookie(stateValue) {
  return stateValue ? JSON.parse(stateValue) : null;
};
var browserStateValueParsed = parseCookie(BrowserCookies.get("loggedInUserState"));
function useLoggedInUserStateBrowser() {
  return {
    isLoggedIn: !!browserStateValueParsed,
    loggedInUserId: browserStateValueParsed == null ? void 0 : browserStateValueParsed.loggedInUserId,
    expiresIn: browserStateValueParsed == null ? void 0 : browserStateValueParsed.expiresIn
  };
}
var useLoggedInUserState = useLoggedInUserStateBrowser;
var getServerAuthCookieValue = function getServerAuthCookieValue(ctx) {
  return getServerCookieValue(ctx, COOKIE_NAME_STATE);
};

export { getServerAuthCookieValue, useLoggedInUserState };
//# sourceMappingURL=index-browser.es.js.map
