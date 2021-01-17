import type React from 'react';
import useT from './useT';
import useTs from './useTs';
interface Props {
    id: string;
    children?: never;
    [propName: string]: any;
}
declare function T({ id, ...props }: Props): React.ReactElement;
export { T, useT, useTs };
//# sourceMappingURL=index.d.ts.map