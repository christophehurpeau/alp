const parseCookie = (stateValue) => {
  return stateValue ? JSON.parse(stateValue) : null;
};

function useLoggedInUserState(serverCookieValue) {
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
    loggedInUserId: void 0,
    expiresIn: void 0
  };
}

const getServerAuthCookieValue = (ctx) => null;

export { getServerAuthCookieValue, useLoggedInUserState };
//# sourceMappingURL=index-node22.mjs.map
