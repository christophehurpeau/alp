'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactAlpContext = _interopDefault(require('react-alp-context'));
var reactAlpTranslate = require('react-alp-translate');
require('../ConnectionState.global.scss');

function ConnectionState(_ref) {
  var state = _ref.state;
  var ctx = React.useContext(ReactAlpContext);
  var notLoggedIn = !ctx.sanitizedState.user;
  var unloadingRef = React.useRef(false);
  var currentStateRef = React.useRef(state);

  if (unloadingRef.current === false) {
    currentStateRef.current = state;
  }

  var currentState = currentStateRef.current;
  React.useEffect(function () {
    var beforeUnloadHandler = function beforeUnloadHandler() {
      unloadingRef.current = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    return function () {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state"
  }, !state || notLoggedIn ? null : /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactAlpTranslate.T, {
    id: "connectionState." + currentState
  })));
}

exports.default = ConnectionState;
//# sourceMappingURL=index-browser.cjs.js.map
