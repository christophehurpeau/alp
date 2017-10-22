export type ReduxActionType = { +type: string };
export type ReduxDispatchType = (action: ReduxActionType) => ReduxActionType | any;
export type ReduxReducerType = (state: any, action: ReduxActionType) => any;
export type ReducerDictionaryType = { [string]: ReduxReducerType };
