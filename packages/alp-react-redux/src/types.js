export {
  ReactNodeType,
  ReactElementType,
  TagNameType,
  ReactClassComponentType,
  ReactStatelessComponentType,
  TagNameOrReactComponentType,
  LayoutPropsType,
} from 'fody/src/types';

export type ModuleDescriptorType = {|
  identifier: ?string,
  View: any,
  reducer: ?Function,
  reducers: ?Object,
  loader: ?Function,
|};
