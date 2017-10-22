import { type Node } from 'react';
import AlpModule from './AlpModule';
import type { ReducerDictionaryType } from '../types';

type PropsType = {|
  reducers: ?ReducerDictionaryType,
  children: Node,
|};

export default class AlpReduxModule extends AlpModule {
  props: PropsType;

  render(): Node {
    return this.props.children;
  }
}
