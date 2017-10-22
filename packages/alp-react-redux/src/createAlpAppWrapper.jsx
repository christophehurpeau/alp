import { Component, type Element } from 'react';
import PropTypes from 'prop-types';

type PropsType = {||};

export default (app: Element, context: Object) =>
  class AlpAppWrapper extends Component {
    props: PropsType;

    static childContextTypes = {
      context: PropTypes.object.isRequired,
      store: PropTypes.object.isRequired,
      setModuleReducers: PropTypes.func,
    };

    state = {
      error: null,
    };

    getChildContext(): Object {
      return context;
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render(): Element {
      if (this.state.error) return <div>An unexpected error occured</div>;
      return app;
    }
  };
