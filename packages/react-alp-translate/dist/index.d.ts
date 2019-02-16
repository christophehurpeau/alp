import * as React from 'react';
import ReactAlpContext from 'react-alp-context';
declare type ChildrenCallback = (translated: string) => React.ReactChild;
interface Props {
    id: string;
    children?: ChildrenCallback;
    [propName: string]: any;
}
export interface AlpContext {
    t: (id: string, args: {
        [key: string]: any;
    }) => string;
}
export default class Translate extends React.Component<Props> {
    static contextType: React.Context<import("alp-types").Context>;
    context: React.ContextType<typeof ReactAlpContext>;
    render(): React.ReactChild;
}
export {};
//# sourceMappingURL=index.d.ts.map