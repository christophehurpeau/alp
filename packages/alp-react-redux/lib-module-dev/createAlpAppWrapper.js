var _jsxFileName = 'createAlpAppWrapper.jsx';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import React from 'react';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import BrowserAppContainer from 'alp-dev/BrowserAppContainer';
import { Component } from 'react';
import PropTypes from 'prop-types';
import { ReactNodeType as _ReactNodeType, ReactComponentType as _ReactComponentType } from './types';

import t from 'flow-runtime';
var ReactNodeType = t.tdz(function () {
  return _ReactNodeType;
});
var ReactComponentType = t.tdz(function () {
  return _ReactComponentType;
});
var PropsType = t.type('PropsType', t.exactObject());


export default (function createAlpAppWrapper(App, context) {
  var _class, _temp;

  var _AppType = t.ref(ReactComponentType);

  var _contextType = t.object();

  t.param('App', _AppType).assert(App);
  t.param('context', _contextType).assert(context);
  return _temp = _class = function (_Component) {
    _inherits(AlpAppWrapper, _Component);

    function AlpAppWrapper() {
      _classCallCheck(this, AlpAppWrapper);

      return _possibleConstructorReturn(this, (AlpAppWrapper.__proto__ || Object.getPrototypeOf(AlpAppWrapper)).apply(this, arguments));
    }

    _createClass(AlpAppWrapper, [{
      key: 'getChildContext',
      value: function getChildContext() {
        var _returnType = t.return(t.object());

        return _returnType.assert(context);
      }
    }, {
      key: 'render',
      value: function render() {
        var _returnType2 = t.return(t.ref(ReactNodeType));

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
    }]);

    return AlpAppWrapper;
  }(Component), _class.propTypes = t.propTypes(PropsType), _class.childContextTypes = {
    context: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
    setModuleReducers: PropTypes.func.isRequired
  }, _temp;
});
//# sourceMappingURL=createAlpAppWrapper.js.map