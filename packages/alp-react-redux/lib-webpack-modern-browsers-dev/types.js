import _t from 'tcomb-forked';
export { ReactNodeType, ReactElementType, LayoutPropsType } from 'fody/types';

export const ModuleDescriptorType = _t.interface({
  identifier: _t.maybe(_t.String),
  View: _t.Any,
  reducer: _t.maybe(_t.Function),
  reducers: _t.maybe(_t.Object),
  loader: _t.maybe(_t.Function)
}, {
  name: 'ModuleDescriptorType',
  strict: true
});
//# sourceMappingURL=types.js.map