import React from 'react';
import { Context } from 'alp-types';
declare global {
    interface Window {
        Raven: any;
    }
}
interface AlpAppProps {
}
interface AlpAppState {
    error: null | Error;
    appState: any;
}
declare const _default: (app: React.ReactChild, context: Context) => {
    new (props: Readonly<AlpAppProps>): {
        state: {
            error: null;
            appState: any;
        };
        componentDidCatch(error: Error, errorInfo: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "error" | "appState">(state: AlpAppState | ((prevState: Readonly<AlpAppState>, props: Readonly<AlpAppProps>) => AlpAppState | Pick<AlpAppState, K> | null) | Pick<AlpAppState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<AlpAppProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    new (props: AlpAppProps, context?: any): {
        state: {
            error: null;
            appState: any;
        };
        componentDidCatch(error: Error, errorInfo: any): void;
        render(): JSX.Element;
        context: any;
        setState<K extends "error" | "appState">(state: AlpAppState | ((prevState: Readonly<AlpAppState>, props: Readonly<AlpAppProps>) => AlpAppState | Pick<AlpAppState, K> | null) | Pick<AlpAppState, K> | null, callback?: (() => void) | undefined): void;
        forceUpdate(callBack?: (() => void) | undefined): void;
        readonly props: Readonly<AlpAppProps> & Readonly<{
            children?: React.ReactNode;
        }>;
        refs: {
            [key: string]: React.ReactInstance;
        };
    };
    contextType?: React.Context<any> | undefined;
};
export default _default;
//# sourceMappingURL=createAlpAppWrapper.d.ts.map