import { Component } from 'react';
import PropTypes from 'prop-types';


export default ((app, context) => {
  var _class, _temp;

  return _temp = _class = class extends Component {

    getChildContext() {
      return context;
    }

    render() {
      return app;
    }
  }, _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp;
});
//# sourceMappingURL=createAlpAppWrapper.js.map