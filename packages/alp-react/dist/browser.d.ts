import React from 'react';
import { BrowserApplication } from 'alp-types';
export { default as Helmet } from 'react-helmet';
export { default as AlpModule } from './module/AlpModule';
export { default as SuspenseWrapper } from './module/SuspenseWrapper';
export { default as Body } from './layout/Body';
export { default as AppContainer } from './layout/AppContainer';
export { default as LoadingFallbackContext } from './contexts/LoadingFallbackContext';
declare global {
    interface Window {
        __INITIAL_DATA__: any;
    }
}
export default function alpReactBrowser(app: BrowserApplication): (App: React.ElementType<{}>) => Promise<void>;
//# sourceMappingURL=browser.d.ts.map