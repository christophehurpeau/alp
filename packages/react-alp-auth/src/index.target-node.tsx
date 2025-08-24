import { getServerCookieValue } from "alp-nextjs";
import type { GetServerSidePropsContext } from "alp-nextjs";
import { COOKIE_NAME_STATE } from "./config";

export { useLoggedInUserState } from "./useLoggedInUserState";

export const getServerAuthCookieValue = (
  ctx: GetServerSidePropsContext,
): string | null => getServerCookieValue(ctx, COOKIE_NAME_STATE);
