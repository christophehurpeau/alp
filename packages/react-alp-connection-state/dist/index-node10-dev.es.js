import React, { useContext, useRef, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';

function ConnectionState({
  state
}) {
  const ctx = useContext(ReactAlpContext);
  const notLoggedIn = !ctx.sanitizedState.user;
  const unloadingRef = useRef(false);
  const currentStateRef = useRef(state);

  if (unloadingRef.current === false) {
    currentStateRef.current = state;
  }

  const currentState = currentStateRef.current;
  useEffect(() => {
    const beforeUnloadHandler = () => {
      unloadingRef.current = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state"
  }, !state || notLoggedIn ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(T, {
    id: `connectionState.${currentState}`
  })));
}

export default ConnectionState;
//# sourceMappingURL=index-node10-dev.es.js.map
