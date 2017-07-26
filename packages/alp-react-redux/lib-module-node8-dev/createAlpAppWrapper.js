var _jsxFileName = 'createAlpAppWrapper.jsx';
import React from 'react';
import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from './types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(() => _ReactNodeType);
const ReactComponentType = t.tdz(() => _ReactComponentType);
const PropsType = t.type('PropsType', t.exactObject());


export default (function createAlpAppWrapper(App, context) {
  var _class, _temp;

  let _AppType = t.ref(ReactComponentType);

  let _contextType = t.object();

  t.param('App', _AppType).assert(App);
  t.param('context', _contextType).assert(context);
  return _temp = _class = class extends Component {

    getChildContext() {
      const _returnType = t.return(t.object());

      return _returnType.assert(context);
    }

    render() {
      const _returnType2 = t.return(t.ref(ReactNodeType));

      return _returnType2.assert(React.createElement(
        BrowserAppContainer,
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        },
        React.createElement(App, {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        })
      ));
    }
  }, _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func.isRequired
  }, _temp;
});
//# sourceMappingURL=createAlpAppWrapper.js.map