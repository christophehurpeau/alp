import React, { Component, ReactType } from 'react';
import ReactAlpContext from 'react-alp-context';
export interface Props {
    as?: ReactType<{
        href: string;
    }>;
    to: string;
    params?: Object;
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
    }>;
}
//# sourceMappingURL=index.d.ts.map