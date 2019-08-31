import React, { useContext, useState, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-connection-state/src/index.tsx";
function ConnectionState() {
  const ctx = useContext(ReactAlpContext);
  const notConnected = !ctx.sanitizedState.user;
  const [connectionState, setConnectionState] = useState(null);
  useEffect(() => {
    const websocket = ctx.app.websocket;
    let unloading = false;
    window.addEventListener('beforeunload', () => {
      unloading = true;
    });
    const connectedHandler = websocket.on('connect', () => {
      setConnectionState('connected');
    });
    const disconnectedHandler = websocket.on('disconnect', () => {
      if (unloading) return;
      setConnectionState('disconnected');
    });
    setConnectionState(websocket.connected ? 'connected' : 'connecting');
    return () => {
      websocket.off('connected', connectedHandler);
      websocket.off('disconnected', disconnectedHandler);
    };
  }, [ctx.app.websocket]);
  return React.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 38
    },
    __self: this
  }, !connectionState || notConnected ? null : React.createElement("div", {
    __source: {
      fileName: _jsxFileName,
      lineNumber: 45
    },
    __self: this
  }, React.createElement(T, {
    id: `connectionState.${connectionState}`,
    __source: {
      fileName: _jsxFileName,
      lineNumber: 46
    },
    __self: this
  })));
}

export default ConnectionState;
//# sourceMappingURL=index-node10-dev.es.js.map
