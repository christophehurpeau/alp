import type { GetServerSidePropsContext } from "alp-nextjs";

export { useLoggedInUserState } from "./useLoggedInUserState";

export const getServerAuthCookieValue = (
  ctx: GetServerSidePropsContext,
): string | null => null;
