import type { GetServerSidePropsContext, NextPageContext } from 'next';
export { type NextPageContext, type GetServerSidePropsContext } from 'next';
export { normalizeNextElementsCSS, getDocumentInitialProps, } from './getDocumentInitialProps';
export declare const getServerCookieValue: (ctx: NextPageContext | GetServerSidePropsContext, cookieName: string) => string | undefined;
//# sourceMappingURL=index.d.ts.map