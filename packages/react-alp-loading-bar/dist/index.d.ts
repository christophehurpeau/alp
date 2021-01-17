import type { ReactElement } from 'react';
import React, { PureComponent } from 'react';
import ReactAlpContext from 'react-alp-context';
interface LoadingBarProps {
    LoadingBarComponent: React.ComponentType<{
        progress: number;
    }>;
}
interface LoadingBarState {
    loading: boolean;
    hidden: boolean;
    progress: number;
}
interface WebsocketInterface {
    isConnected: () => boolean;
    on: (event: 'connect' | 'disconnect', callback: () => unknown) => void;
}
export default class LoadingBar extends PureComponent<LoadingBarProps, LoadingBarState> {
    static contextType: React.Context<import("alp-types").Context>;
    context: React.ContextType<typeof ReactAlpContext>;
    state: {
        loading: boolean;
        hidden: boolean;
        progress: number;
    };
    fadeOffTimeout?: any;
    resetTimeout?: any;
    first20Timeout?: any;
    progressTimer?: any;
    componentDidMount(): void;
    componentDidUpdate(prevProps: LoadingBarProps, prevState: LoadingBarState): void;
    componentWillUnmount(): void;
    getWebsocket(): WebsocketInterface;
    private showBar;
    private hideBar;
    render(): ReactElement;
}
export {};
//# sourceMappingURL=index.d.ts.map