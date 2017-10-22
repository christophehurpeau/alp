import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';

export default (function (app, context) {
  var _class, _temp2;

  return _temp2 = _class = class extends Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      return context;
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      if (this.state.error) return React.createElement(
        'div',
        null,
        'An unexpected error occured'
      );
      return app;
    }
  }, _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp2;
});
//# sourceMappingURL=createAlpAppWrapper.js.map