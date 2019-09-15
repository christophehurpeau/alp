import { match as Match } from 'react-router';
import { ComponentType, ReactElement, ReactNode } from 'react';
import { Except } from 'type-fest';
export interface BaseComponentProps<Params> {
    match: Match<Params> | null;
    exiting: boolean;
    onClose: () => void;
}
interface WrapperComponentProps {
    children: ReactNode;
    visible: boolean;
}
interface RouteMatchTransitionProps<Params, ComponentProps extends BaseComponentProps<Params>> {
    path: string;
    closePath: string;
    timeout: number;
    component: ComponentType<ComponentProps>;
    wrapperComponent?: ComponentType<WrapperComponentProps>;
}
export default function RouteMatchTransition<Params, AllProps extends {
    [P in keyof BaseComponentProps<Params>]?: never;
} & RouteMatchTransitionProps<any, any>>({ path, closePath, timeout, component: Component, wrapperComponent: WrapperComponent, ...otherProps }: RouteMatchTransitionProps<Params, BaseComponentProps<Params> & Except<AllProps, keyof RouteMatchTransitionProps<any, any>>> & AllProps): ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map