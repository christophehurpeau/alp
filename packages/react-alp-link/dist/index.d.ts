/// <reference types="react" />
import { ComponentType } from 'react';
export interface Props {
    as?: ComponentType<{
        href: string;
    }>;
    to: string;
    params?: Object;
    children: any;
    tagName?: never;
}
export interface Context {
    urlGenerator: Function;
}
export interface ContextType {
    context: Context;
}
declare const LinkComponent: ComponentType<Props>;
export default LinkComponent;
