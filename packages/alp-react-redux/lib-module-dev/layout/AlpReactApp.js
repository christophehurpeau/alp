var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _class,
    _temp,
    _jsxFileName = 'layout/AlpReactApp.jsx';

import React from 'react';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import { Component } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { ReactNodeType as _ReactNodeType } from '../types';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var PropsType = t.type('PropsType', t.exactObject(t.property('children', t.nullable(t.ref(ReactNodeType)))));
var App = (_temp = _class = function (_Component) {
  _inherits(App, _Component);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).apply(this, arguments));
  }

  _createClass(App, [{
    key: 'getChildContext',
    value: function getChildContext() {
      var _returnType = t.return(t.object());

      return _returnType.assert({ context: this.props.context });
    }
  }, {
    key: 'render',
    value: function render() {
      var _returnType2 = t.return(t.ref(ReactNodeType));

      var children = this.props.children;

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
  }]);

  return App;
}(Component), _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
  context: PropTypes.object.isRequired
}, _temp);
export { App as default };
//# sourceMappingURL=AlpReactApp.js.map