import AlpModule from './AlpModule';
import type { ReactNodeType, ReactElementType, ReducerDictionaryType } from '../types';

type PropsType = {|
  reducers: ?ReducerDictionaryType,
  children: ReactNodeType,
|};

export default class AlpReduxModule extends AlpModule {
  props: PropsType;

  render(): ReactElementType {
    return this.props.children;
  }
}
