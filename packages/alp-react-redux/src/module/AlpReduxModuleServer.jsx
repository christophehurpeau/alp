import { type Node } from 'react';
import type { ReducerDictionaryType } from '../types';
import AlpModule from './AlpModule';

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
