import Cookies from 'cookies';
import type { GetServerSidePropsContext, NextPageContext } from 'next';

export { type NextPageContext, type GetServerSidePropsContext } from 'next';

export {
  normalizeNextElementsCSS,
  getDocumentInitialProps,
} from './getDocumentInitialProps';

export const getServerCookieValue = (
  ctx: NextPageContext | GetServerSidePropsContext,
  cookieName: string,
): string | undefined => {
  if (!ctx.req || !ctx.res) {
    throw new Error(
      'Missing ctx.req or ctx.res. Make sure getInitialProps is set.',
    );
  }

  const cookies = new Cookies(ctx.req, ctx.res);
  return cookies.get(cookieName);
};
