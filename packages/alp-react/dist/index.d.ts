import React from 'react';
import Helmet from 'react-helmet';
import { Context } from 'alp-types';
export { Helmet };
export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export { default as LoadingFallbackContext, } from './contexts/LoadingFallbackContext';
interface Options {
    polyfillFeatures?: string;
    scriptName?: string | false;
    styleName?: string | false;
}
export declare type ReactAppCallback = (ctx: Context) => Promise<void>;
declare const _default: (App: React.ElementType<{}>, options?: Options) => ReactAppCallback;
export default _default;
//# sourceMappingURL=index.d.ts.map