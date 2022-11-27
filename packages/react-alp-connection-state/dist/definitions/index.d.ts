import type { ReactElement, ReactNode } from 'react';
declare const defaultTheme: {
    container: {
        backgroundColor: string;
        color: string;
        textShadowColor: string;
        textShadowOffset: {
            width: number;
            height: number;
        };
        textShadowRadius: number;
    };
    backgroundColorConnected: string;
};
export type ConnectionStateTheme = typeof defaultTheme;
export type State = null | 'connecting' | 'connected' | 'disconnected';
export interface ConnectionStateProps {
    theme?: ConnectionStateTheme;
    forceHidden?: boolean;
    state: State;
    children: NonNullable<ReactNode>;
}
export declare function ConnectionState({ theme, forceHidden, state, children, }: ConnectionStateProps): ReactElement | null;
export {};
//# sourceMappingURL=index.d.ts.map