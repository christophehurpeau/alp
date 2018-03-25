import { type Node } from 'react';
import PropTypes from 'prop-types';
import type { ReducerDictionaryType } from '../types';
import AlpModule from './AlpModule';

type PropsType = {|
  children: Node,
  reducers: ?ReducerDictionaryType,
|};

export default class AlpReduxModule extends AlpModule {
  props: PropsType;

  static contextTypes = {
    setModuleReducers: PropTypes.func.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      loading: this.setModuleReducers(props.reducers),
    };
  }

  setModuleReducers(reducers) {
    if (!this.context.setModuleReducers) return false; // pre render
    const result = this.context.setModuleReducers(reducers);
    if (result === false) return false;
    result.then(() => {
      this.setState({ loading: false });
    });
    return true;
  }

  componentWillReceiveProps(nextProps: PropTypes) {
    if (nextProps.reducers !== this.props.reducers) {
      this.setState({
        loading: this.setModuleReducers(nextProps.reducers),
      });
    }
  }

  render(): Node {
    return this.state.loading ? null : this.props.children;
  }
}
