import React from 'react';

import { Component } from 'react';
import PropTypes from 'prop-types';


export default ((App, context) => {
  var _class, _temp;

  return _temp = _class = class extends Component {

    getChildContext() {
      return context;
    }

    render() {
      return React.createElement(App, null);
    }
  }, _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func.isRequired
  }, _temp;
});
//# sourceMappingURL=createAlpAppWrapper.js.map