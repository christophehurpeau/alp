import t from "flow-runtime";
export const ReduxActionType = t.type("ReduxActionType", t.object(t.property("type", t.string())));
export const ReduxDispatchType = t.type("ReduxDispatchType", t.function(t.param("action", ReduxActionType), t.return(t.union(ReduxActionType, t.any()))));
export const ReduxReducerType = t.type("ReduxReducerType", t.function(t.param("state", t.any()), t.param("action", ReduxActionType), t.return(t.any())));
export const ReducerDictionaryType = t.type("ReducerDictionaryType", t.object(t.indexer("key", t.string(), ReduxReducerType)));
//# sourceMappingURL=types.js.map