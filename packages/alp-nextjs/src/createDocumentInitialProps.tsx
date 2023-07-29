import type NextDocument from 'next/document';
import type { ReactElement } from 'react';
// eslint-disable-next-line import/no-unresolved
import { StyleSheet } from 'react-native';

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

export function createDocumentInitialProps(
  getMoreStyles?: () => ReactElement | ReactElement[],
): (typeof NextDocument)['getInitialProps'] {
  return async (ctx) => {
    const page = await ctx.renderPage();

    // @ts-expect-error -- RN doesn't have this type
    const rnwStyle = StyleSheet.getSheet();

    return {
      ...page,
      styles: (
        <>
          <style
            dangerouslySetInnerHTML={{ __html: rnwStyle.textContent }}
            id={rnwStyle.id}
          />
          {getMoreStyles?.()}
        </>
      ),
    };
  };
}
