import Cookies from "cookies";
import type { GetServerSidePropsContext, NextPageContext } from "next";

export { type NextPageContext, type GetServerSidePropsContext } from "next";

export { createDocumentInitialProps } from "./createDocumentInitialProps";

export const getServerCookieValue = (
  ctx: GetServerSidePropsContext | NextPageContext,
  cookieName: string,
): string | null => {
  if (!ctx.req || !ctx.res) {
    throw new Error(
      "Missing ctx.req or ctx.res. Make sure getInitialProps is set.",
    );
  }

  const cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName) || null;
};
