import React, { Component, ReactType } from 'react';
import ReactAlpContext from 'react-alp-context';
export interface Props {
    as?: ReactType<{
        href: string;
    }>;
    to: string;
    params?: Record<string, any>;
    children: any;
    tagName?: never;
}
export default class LinkComponent extends Component<Props> {
    static defaultProps: {
        as: string;
        to: string;
    };
    static contextType: React.Context<import("alp-types").Context>;
    context: React.ContextType<typeof ReactAlpContext>;
    render(): React.ReactElement<{
        href: string;
    }, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)> | null) | (new (props: any) => React.Component<any, any, any>)>;
}
//# sourceMappingURL=index.d.ts.map