import { Component } from 'react';
import PropTypes from 'prop-types';
import type { ReactNodeType, ReactElementType } from './types';

type PropsType = {||};

export default (app: ReactElementType, context: Object) =>
  class AlpAppWrapper extends Component {
    props: PropsType;

    static childContextTypes = {
      context: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      setModuleReducers: PropTypes.func,
    };

    getChildContext(): Object {
      return context;
    }

    render(): ReactNodeType {
      return app;
    }
  };
