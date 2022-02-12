import { useContext, useRef, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import { jsx } from 'react/jsx-runtime';

function ConnectionState({
  state
}) {
  const ctx = useContext(ReactAlpContext);
  const notLoggedIn = !ctx.sanitizedState.user;
  const unloadingRef = useRef(false);
  const currentStateRef = useRef(state);

  if (!unloadingRef.current) {
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
  return /*#__PURE__*/jsx("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state",
    children: !state || notLoggedIn ? null : /*#__PURE__*/jsx("div", {
      children: /*#__PURE__*/jsx(T, {
        id: `connectionState.${currentState}`
      })
    })
  });
}

export { ConnectionState as default };
//# sourceMappingURL=index-node14.mjs.map
