var _class, _temp;

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
let App = (_temp = _class = class extends Component {

  getChildContext() {
    return { context: this.props.context };
  }

  render() {
    const { children } = this.props;
    return React.createElement(
      'div',
      null,
      React.createElement(
        Helmet,
        null,
        React.createElement('meta', { charSet: 'utf-8' }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' })
      ),
      children
    );
  }
}, _class.childContextTypes = {
  context: PropTypes.object.isRequired
}, _temp);
export { App as default };
//# sourceMappingURL=AlpReactApp.js.map