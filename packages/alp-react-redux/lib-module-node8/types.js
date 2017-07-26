import t from 'flow-runtime';
import { isValidElement, Component } from 'react';

export const ReactElementType = t.refinement(t.object(), input => {
  if (!isValidElement(input)) return 'not a valid react element';
});

export const ReactNodeType = t.type('React$Node', ReactNodeType => t.union(t.null(), t.void(), t.string(), t.number(), ReactElementType, t.array(ReactNodeType)));
//# sourceMappingURL=types.js.map