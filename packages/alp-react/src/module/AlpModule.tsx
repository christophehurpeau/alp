import { Component, ReactNode } from 'react';

export interface Props {
  children: ReactNode;
}

export default class AlpModule<T extends Props> extends Component<T> {
  render(): ReactNode {
    return this.props.children;
  }
}
