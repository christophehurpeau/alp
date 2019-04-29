import React, { useContext, useState, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';

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
  });
  return React.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state"
  }, !connectionState || notConnected ? null : React.createElement("div", null, React.createElement(T, {
    id: `connectionState.${connectionState}`
  })));
}

export default ConnectionState;
//# sourceMappingURL=index-node10.es.js.map
