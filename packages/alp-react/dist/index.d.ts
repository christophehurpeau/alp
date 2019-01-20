import React from 'react';
import Helmet from 'react-helmet';
import { Context } from 'alp-types';
export { Helmet };
export { default as AlpModule } from './module/AlpModule';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
interface Options {
    polyfillFeatures?: string;
    scriptName?: string | false;
    styleName?: string | false;
}
declare const _default: (App: React.ReactType<any>, options?: Options) => (ctx: Context) => Promise<void>;
export default _default;
//# sourceMappingURL=index.d.ts.map