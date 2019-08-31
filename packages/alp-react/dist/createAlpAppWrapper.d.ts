import React, { ReactChild } from 'react';
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
export default function createAlpAppWrapper(app: ReactChild, context: Context): {
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
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<AlpAppProps>, prevState: Readonly<AlpAppState>): any;
        componentDidUpdate?(prevProps: Readonly<AlpAppProps>, prevState: Readonly<AlpAppState>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<AlpAppProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<AlpAppProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): void;
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
        componentDidMount?(): void;
        shouldComponentUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): boolean;
        componentWillUnmount?(): void;
        getSnapshotBeforeUpdate?(prevProps: Readonly<AlpAppProps>, prevState: Readonly<AlpAppState>): any;
        componentDidUpdate?(prevProps: Readonly<AlpAppProps>, prevState: Readonly<AlpAppState>, snapshot?: any): void;
        componentWillMount?(): void;
        UNSAFE_componentWillMount?(): void;
        componentWillReceiveProps?(nextProps: Readonly<AlpAppProps>, nextContext: any): void;
        UNSAFE_componentWillReceiveProps?(nextProps: Readonly<AlpAppProps>, nextContext: any): void;
        componentWillUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): void;
        UNSAFE_componentWillUpdate?(nextProps: Readonly<AlpAppProps>, nextState: Readonly<AlpAppState>, nextContext: any): void;
    };
    contextType?: React.Context<any> | undefined;
};
export {};
//# sourceMappingURL=createAlpAppWrapper.d.ts.map