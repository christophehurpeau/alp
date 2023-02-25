import { POB_TARGET } from 'pob-babel';
import type { GetServerSidePropsContext } from 'alp-nextjs';
import { getServerCookieValue } from 'alp-nextjs';
import BrowserCookies from 'js-cookie';

const COOKIE_NAME_STATE = 'loggedInUserState';

interface AuthStateValue {
  loggedInUserId: string;
  expiresIn: number;
}

const parseCookie = (stateValue?: string): AuthStateValue | null => {
  return stateValue ? (JSON.parse(stateValue) as AuthStateValue) : null;
};

interface LoggedInUserState {
  isLoggedIn: boolean;
  loggedInUserId: string | undefined;
  expiresIn: number | undefined;
}

const browserStateValueParsed = parseCookie(
  BrowserCookies.get(COOKIE_NAME_STATE),
);

function useLoggedInUserStateBrowser(): LoggedInUserState {
  return {
    isLoggedIn: !!browserStateValueParsed,
    loggedInUserId: browserStateValueParsed?.loggedInUserId,
    expiresIn: browserStateValueParsed?.expiresIn,
  };
}

function useLoggedInUserStateServer(
  serverCookieValue?: string,
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

export const useLoggedInUserState =
  POB_TARGET === 'node'
    ? useLoggedInUserStateServer
    : useLoggedInUserStateBrowser;

export const getServerAuthCookieValue = (
  ctx: GetServerSidePropsContext,
): string | undefined => getServerCookieValue(ctx, COOKIE_NAME_STATE);
