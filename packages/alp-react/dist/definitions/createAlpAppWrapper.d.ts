import type { Context } from 'alp-types';
import type { ComponentClass, ReactChild } from 'react';
declare global {
    interface Window {
        Sentry?: {
            captureException: (error: Error, extra: unknown) => void;
        };
    }
}
interface AlpAppProps {
}
interface AlpAppState {
    error: null | Error;
}
export default function createAlpAppWrapper(app: ReactChild, context: Context): ComponentClass<AlpAppProps, AlpAppState>;
export {};
//# sourceMappingURL=createAlpAppWrapper.d.ts.map