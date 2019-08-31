'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var ReactAlpContext = _interopDefault(require('react-alp-context'));
var reactAlpTranslate = require('react-alp-translate');
require('../ConnectionState.global.scss');

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-connection-state/src/index.tsx";
function ConnectionState() {
  var ctx = React.useContext(ReactAlpContext);
  var notConnected = !ctx.sanitizedState.user;

  var _useState = React.useState(null),
      connectionState = _useState[0],
      setConnectionState = _useState[1];

  React.useEffect(function () {
    var websocket = ctx.app.websocket;
    var unloading = false;
    window.addEventListener('beforeunload', function () {
      unloading = true;
    });
    var connectedHandler = websocket.on('connect', function () {
      setConnectionState('connected');
    });
    var disconnectedHandler = websocket.on('disconnect', function () {
      if (unloading) return;
      setConnectionState('disconnected');
    });
    setConnectionState(websocket.connected ? 'connected' : 'connecting');
    return function () {
      websocket.off('connected', connectedHandler);
      websocket.off('disconnected', disconnectedHandler);
    };
  }, [ctx.app.websocket]);
  return React__default.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, !connectionState || notConnected ? null : React__default.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, React__default.createElement(reactAlpTranslate.T, {
    id: "connectionState." + connectionState,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  })));
}

exports.default = ConnectionState;
//# sourceMappingURL=index-browser-dev.cjs.js.map
