import { ElementType } from 'react';
import Helmet from 'react-helmet';
import { Context } from 'alp-types';
export { Helmet };
export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export { default as LoadingFallbackContext } from './contexts/LoadingFallbackContext';
interface Options {
    polyfillFeatures?: string;
    scriptName?: string | false;
    styleName?: string | false;
}
export declare type ReactAppCallback = (ctx: Context) => void;
export default function alpReact(App: ElementType<{}>, options?: Options): ReactAppCallback;
//# sourceMappingURL=index.d.ts.map