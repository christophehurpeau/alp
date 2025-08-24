import BrowserCookies from 'js-cookie';

const COOKIE_NAME_STATE = "loggedInUserState";

const parseCookie = (stateValue) => {
  return stateValue ? JSON.parse(stateValue) : null;
};

const browserStateValueParsed = parseCookie(
  BrowserCookies.get(COOKIE_NAME_STATE)
);
function useLoggedInUserState(serverCookieValue) {
  return {
    isLoggedIn: !!browserStateValueParsed,
    loggedInUserId: browserStateValueParsed?.loggedInUserId,
    expiresIn: browserStateValueParsed?.expiresIn
  };
}

const getServerAuthCookieValue = (ctx) => null;

export { getServerAuthCookieValue, useLoggedInUserState };
//# sourceMappingURL=index-browser.es.js.map
