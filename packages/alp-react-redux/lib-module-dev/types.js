import t from 'flow-runtime';
import { isValidElement, Component } from 'react';

export var ReactElementType = t.refinement(t.object(), function (input) {
  if (!isValidElement(input)) return 'not a valid react element';
});

export var ReactNodeType = t.type('React$Node', function (ReactNodeType) {
  return t.union(t.null(), t.void(), t.string(), t.number(), ReactElementType, t.array(ReactNodeType));
});

export var TagNameType = t.type('TagNameType', t.string());
export var ReactClassComponentType = t.type('ReactClassComponentType', t.ref(Component));
export var ReactStatelessComponentType = t.type('ReactStatelessComponentType', t.function(t.param('props', t.object()), t.return(t.ref(ReactNodeType))));
export var ReactComponentType = t.type('ReactComponentType', t.union(ReactClassComponentType, ReactStatelessComponentType));
export var TagNameOrReactComponentType = t.type('TagNameOrReactComponentType', t.union(TagNameType, ReactComponentType));

export var ReduxActionType = t.type('ReduxActionType', t.object(t.property('type', t.string())));
export var ReduxDispatchType = t.type('ReduxDispatchType', t.function(t.param('action', ReduxActionType), t.return(t.union(ReduxActionType, t.any()))));
export var ReduxReducerType = t.type('ReduxReducerType', t.function(t.param('state', t.any()), t.param('action', ReduxActionType), t.return(t.any())));
export var ReducerDictionaryType = t.type('ReducerDictionaryType', t.object(t.indexer('key', t.string(), ReduxReducerType)));
//# sourceMappingURL=types.js.map