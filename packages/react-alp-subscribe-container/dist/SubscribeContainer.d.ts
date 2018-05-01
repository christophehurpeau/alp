/// <reference types="react" />
import { Component, ReactElement } from 'react';
import { Dispatch } from 'redux';
import PropTypes from 'prop-types';
export interface OwnProps {
    children: ReactElement<any>;
    name?: string;
    names?: Array<string>;
    visibleTimeout?: number;
}
export interface ConnectProps {
    dispatch: Dispatch<any>;
}
export default class SubscribeContainer extends Component<OwnProps & ConnectProps, never> {
    static defaultProps: {
        visibleTimeout: number;
    };
    static contextTypes: {
        context: PropTypes.Requireable<any>;
    };
    subscribed: boolean;
    timeout: number | undefined;
    componentDidMount(): void;
    componentWillUnmount(): void;
    getWebsocket(): any;
    handleVisibilityChange: () => void;
    subscribe: () => void;
    unsubscribe: () => void;
    render(): ReactElement<any>;
}
