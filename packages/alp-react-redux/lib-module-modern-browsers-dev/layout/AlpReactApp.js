var _class,
    _temp,
    _jsxFileName = 'layout/AlpReactApp.jsx';

import React from 'react';
import { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ReactNodeType as _ReactNodeType } from '../types';

import t from 'flow-runtime';
const ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
const PropsType = t.type('PropsType', t.exactObject(t.property('children', t.nullable(t.ref(ReactNodeType)))));
let App = (_temp = _class = class extends Component {

  getChildContext() {
    const _returnType = t.return(t.object());

    return _returnType.assert({ context: this.props.context });
  }

  render() {
    const _returnType2 = t.return(t.ref(ReactNodeType));

    const { children } = this.props;
    return _returnType2.assert(React.createElement(
      'div',
      {
        __self: this,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 24
        }
      },
      React.createElement(
        Helmet,
        {
          __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 25
          }
        },
        React.createElement('meta', { charSet: 'utf-8', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 26
          }
        }),
        React.createElement('meta', { name: 'viewport', content: 'width=device-width, initial-scale=1', __self: this,
          __source: {
            fileName: _jsxFileName,
            lineNumber: 27
          }
        })
      ),
      children
    ));
  }
}, _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
  context: PropTypes.object.isRequired
}, _temp);
export { App as default };
//# sourceMappingURL=AlpReactApp.js.map