import React, { useContext, useState, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';

function ConnectionState() {
  var ctx = useContext(ReactAlpContext);
  var notConnected = !ctx.sanitizedState.user;

  var _useState = useState(null),
      connectionState = _useState[0],
      setConnectionState = _useState[1];

  useEffect(function () {
    var websocket = ctx.app.websocket;
    var unloading = false;

    var beforeUnloadHandler = function beforeUnloadHandler() {
      unloading = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
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
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [ctx.app.websocket]);
  return /*#__PURE__*/React.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state"
  }, !connectionState || notConnected ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(T, {
    id: "connectionState." + connectionState
  })));
}

export default ConnectionState;
//# sourceMappingURL=index-browser.es.js.map
