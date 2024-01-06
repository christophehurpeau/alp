import type { ReactElement } from 'react';
import { PureComponent } from 'react';
interface LoadingBarProps {
    LoadingBarComponent: React.ComponentType<{
        progress: number;
    }>;
    websocket: WebsocketInterface;
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
    state: {
        loading: boolean;
        hidden: boolean;
        progress: number;
    };
    fadeOffTimeout?: ReturnType<typeof setTimeout>;
    resetTimeout?: ReturnType<typeof setTimeout>;
    first20Timeout?: ReturnType<typeof setTimeout>;
    progressTimer?: ReturnType<typeof setTimeout>;
    componentDidMount(): void;
    componentDidUpdate(prevProps: LoadingBarProps, prevState: LoadingBarState): void;
    componentWillUnmount(): void;
    private showBar;
    private hideBar;
    render(): ReactElement;
}
export {};
//# sourceMappingURL=index.d.ts.map