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
    getWebsocket(): any;
    componentDidMount(): void;
    render(): JSX.Element;
    componentDidUpdate(prevProps: LoadingBarProps, prevState: LoadingBarState): void;
    componentWillUnmount(): void;
    private showBar;
    private hideBar;
}
export {};
//# sourceMappingURL=index.d.ts.map