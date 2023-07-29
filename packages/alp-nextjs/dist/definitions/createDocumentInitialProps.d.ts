import type NextDocument from 'next/document';
import { ReactElement } from 'react';
/**
 *
 * @example
 * ```
 * export { createGetDocumentInitialProps } from 'alp-nextjs';
 *
 * export default class MyDocument extends NextDocument {
 *   static getInitialProps = createGetDocumentInitialProps(() => <style>custom style</style>);
 * }
 * ```
 */
export declare function createDocumentInitialProps(getMoreStyles?: () => ReactElement | ReactElement[]): (typeof NextDocument)['getInitialProps'];
//# sourceMappingURL=createDocumentInitialProps.d.ts.map