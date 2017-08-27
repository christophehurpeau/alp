import t from 'flow-runtime';
import { isValidElement, Component } from 'react';

export const ReactElementType = t.refinement(t.object(), input => {
  if (!isValidElement(input)) return 'not a valid react element';
});

export const ReactNodeType = t.type('React$Node', ReactNodeType =>
  t.union(t.null(), t.void(), t.string(), t.number(), ReactElementType, t.array(ReactNodeType)),
);

export type TagNameType = string;
export type ReactClassComponentType = Component;
export type ReactStatelessComponentType = (props: Object) => ReactNodeType;
export type ReactComponentType = ReactClassComponentType | ReactStatelessComponentType;
export type TagNameOrReactComponentType = TagNameType | ReactComponentType;

export type ReduxActionType = { type: string };
export type ReduxDispatchType = (action: ReduxActionType) => ReduxActionType | any;
export type ReduxReducerType = (state: any, action: ReduxActionType) => any;
export type ReducerDictionaryType = { [string]: ReduxReducerType };
