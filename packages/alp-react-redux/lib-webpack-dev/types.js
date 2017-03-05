import t from 'flow-runtime';
export { ReactNodeType, ReactElementType, LayoutPropsType } from 'fody/types';

export var ModuleDescriptorType = t.type('ModuleDescriptorType', t.exactObject(t.property('identifier', t.nullable(t.string())), t.property('View', t.any()), t.property('reducer', t.nullable(t.function())), t.property('reducers', t.nullable(t.object())), t.property('loader', t.nullable(t.function()))));
//# sourceMappingURL=types.js.map