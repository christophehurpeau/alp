'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);
const ReactAlpContext = _interopDefault(require('react-alp-context'));
const reactAlpTranslate = require('react-alp-translate');

function ConnectionState() {
  const ctx = React.useContext(ReactAlpContext);
  const notConnected = !ctx.sanitizedState.user;
  const [connectionState, setConnectionState] = React.useState(null);
  React.useEffect(() => {
    const websocket = ctx.app.websocket;
    let unloading = false;

    const beforeUnloadHandler = () => {
      unloading = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
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
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [ctx.app.websocket]);
  return React__default.createElement("div", {
    hidden: !connectionState || notConnected || connectionState === 'connected',
    className: "alp-connection-state"
  }, !connectionState || notConnected ? null : React__default.createElement("div", null, React__default.createElement(reactAlpTranslate.T, {
    id: `connectionState.${connectionState}`
  })));
}

exports.default = ConnectionState;
//# sourceMappingURL=index-node8.cjs.js.map
