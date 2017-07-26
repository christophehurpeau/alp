import { Component } from 'react';
import PropTypes from 'prop-types';
import type { ReactNodeType, ReactElementType } from '../types';

type PropsType = {|
  reducers: { [string]: any },
  children: ReactNodeType,
|};

export default class AlpReduxModule extends Component {
  props: PropsType;

  static contextTypes = {
    setModuleReducers: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.context.setModuleReducers(props.reducers);
  }

  render(): ReactElementType {
    return this.props.children;
  }
}
