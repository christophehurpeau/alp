import React from 'react';
import { Component, Element as _Element } from 'react';
import PropTypes from 'prop-types';

import t from 'flow-runtime';
const Element = t.tdz(() => _Element);
const PropsType = t.type('PropsType', t.exactObject());


export default (function createAlpAppWrapper(app, context) {
  var _class, _temp2;

  let _appType = t.ref(Element);

  let _contextType = t.object();

  t.param('app', _appType).assert(app);
  t.param('context', _contextType).assert(context);
  return _temp2 = _class = class extends Component {
    constructor(...args) {
      var _temp;

      return _temp = super(...args), this.state = {
        error: null
      }, _temp;
    }

    getChildContext() {
      const _returnType = t.return(t.object());

      return _returnType.assert(context);
    }

    componentDidCatch(error, errorInfo) {
      this.setState({ error });
      console.error(error, errorInfo);
      if (window.Raven) window.Raven.captureException(error, { extra: errorInfo });
    }

    render() {
      const _returnType2 = t.return(t.ref(Element));

      if (this.state.error) return _returnType2.assert(React.createElement(
        'div',
        null,
        'An unexpected error occured'
      ));
      return _returnType2.assert(app);
    }
  }, _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func
  }, _temp2;
});
//# sourceMappingURL=createAlpAppWrapper.js.map