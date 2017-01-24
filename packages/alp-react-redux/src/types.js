export { ReactNodeType, ReactElementType, LayoutPropsType } from 'fody/src/types';

export type ModuleDescriptorType = {|
  identifier: ?string,
  View: any,
  reducer: ?Function,
  reducers: ?Object,
  loader: ?Function,
|};
