import type { GetServerSidePropsContext, NextPageContext } from "next";
export { type NextPageContext, type GetServerSidePropsContext } from "next";
export { createDocumentInitialProps } from "./createDocumentInitialProps";
export declare const getServerCookieValue: (ctx: GetServerSidePropsContext | NextPageContext, cookieName: string) => string | null;
//# sourceMappingURL=index.d.ts.map