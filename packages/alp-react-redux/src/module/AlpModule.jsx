import { Component } from 'react';
import type { ReactNodeType, ReactElementType } from '../types';

type PropsType = {|
  children: ReactNodeType,
|};

export default class AlpModule extends Component {
  props: PropsType;

  render(): ReactElementType {
    if (!PRODUCTION) {
      if (this.props.reducers) {
        throw new Error('You have reducers, probably want to use AlpReduxModule.');
      }
    }
    return this.props.children;
  }
}
