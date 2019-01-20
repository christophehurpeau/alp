import React, { Component, ReactNode } from 'react';
import ReactAlpContext from 'react-alp-context';
export interface SubscribeContainerProps {
    children: ReactNode;
    onEvent: (e: any) => any;
    name?: string;
    names?: Array<string>;
    visibleTimeout?: number;
}
export default class SubscribeContainer extends Component<SubscribeContainerProps> {
    static defaultProps: {
        visibleTimeout: number;
    };
    static contextType: React.Context<import("alp-types").Context>;
    context: React.ContextType<typeof ReactAlpContext>;
    subscribed: boolean;
    timeout: number | undefined;
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleVisibilityChange: () => void;
    subscribe: () => void;
    unsubscribe: () => void;
    getWebsocket(): any;
    render(): React.ReactNode;
}
//# sourceMappingURL=index.d.ts.map