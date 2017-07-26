import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import { Component } from 'react';
import PropTypes from 'prop-types';
import type { ReactNodeType, ReactComponentType } from './types';

type PropsType = {||};

export default (App: ReactComponentType, context: Object) =>
  class AlpAppWrapper extends Component {
    static childContextTypes = {
      context: PropTypes.object.isRequired,
      app: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      setModuleReducers: PropTypes.func.isRequired,
    };

    getChildContext(): Object {
      return context;
    }

    props: PropsType;

    render(): ReactNodeType {
      return PRODUCTION
        ? <App />
        : <BrowserAppContainer>
            <App />
          </BrowserAppContainer>;
    }
  };
