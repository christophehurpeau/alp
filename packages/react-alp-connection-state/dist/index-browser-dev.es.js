import React, { useContext, useState, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-connection-state/src/index.tsx";
function ConnectionState() {
  var ctx = useContext(ReactAlpContext);
  var notConnected = !ctx.sanitizedState.user;

  var _useState = useState(null),
      connectionState = _useState[0],
      setConnectionState = _useState[1];

  useEffect(function () {
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
  });
  return React.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 49
    },
    __self: this
  }, !connectionState || notConnected ? null : React.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 56
    },
    __self: this
  }, React.createElement(T, {
    id: "connectionState." + connectionState,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 57
    },
    __self: this
  })));
}

export default ConnectionState;
//# sourceMappingURL=index-browser-dev.es.js.map