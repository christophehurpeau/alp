import t from 'flow-runtime';
import { isValidElement, Component } from 'react';

export const ReactElementType = t.refinement(t.object(), function (input) {
  if (!isValidElement(input)) return 'not a valid react element';
});

export const ReactNodeType = t.type('React$Node', function (ReactNodeType) {
  return t.union(t.null(), t.void(), t.string(), t.number(), ReactElementType, t.array(ReactNodeType));
});

export const TagNameType = t.type('TagNameType', t.string());
export const ReactClassComponentType = t.type('ReactClassComponentType', t.ref(Component));
export const ReactStatelessComponentType = t.type('ReactStatelessComponentType', t.function(t.param('props', t.object()), t.return(t.ref(ReactNodeType))));
export const ReactComponentType = t.type('ReactComponentType', t.union(ReactClassComponentType, ReactStatelessComponentType));
export const TagNameOrReactComponentType = t.type('TagNameOrReactComponentType', t.union(TagNameType, ReactComponentType));

export const ModuleDescriptorType = t.type('ModuleDescriptorType', t.exactObject(t.property('identifier', t.nullable(t.string())), t.property('View', t.any()), t.property('reducer', t.nullable(t.function())), t.property('reducers', t.nullable(t.object())), t.property('loader', t.nullable(t.function()))));
//# sourceMappingURL=types.js.map