import AlpModule from './AlpModule';
import type { ReactNodeType, ReactElementType } from '../types';

type PropsType = {|
  reducers: { [string]: any },
  children: ReactNodeType,
|};

export default class AlpReduxModule extends AlpModule {
  props: PropsType;

  render(): ReactElementType {
    return this.props.children;
  }
}
