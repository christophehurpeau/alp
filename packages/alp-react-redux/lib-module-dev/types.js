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

export var ModuleDescriptorType = t.type('ModuleDescriptorType', t.exactObject(t.property('identifier', t.nullable(t.string())), t.property('View', t.any()), t.property('reducer', t.nullable(t.function())), t.property('reducers', t.nullable(t.object())), t.property('loader', t.nullable(t.function()))));

export var ReduxActionType = t.type('ReduxActionType', t.object(t.property('type', t.string())));
export var ReduxDispatchType = t.type('ReduxDispatchType', t.function(t.param('action', ReduxActionType), t.return(t.union(ReduxActionType, t.any()))));
//# sourceMappingURL=types.js.map