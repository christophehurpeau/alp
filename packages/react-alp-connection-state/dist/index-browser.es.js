import { useContext, useRef, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';
import { jsx } from 'react/jsx-runtime.js';

function ConnectionState(_ref) {
  var state = _ref.state;
  var ctx = useContext(ReactAlpContext);
  var notLoggedIn = !ctx.sanitizedState.user;
  var unloadingRef = useRef(false);
  var currentStateRef = useRef(state);

  if (!unloadingRef.current) {
    currentStateRef.current = state;
  }

  var currentState = currentStateRef.current;
  useEffect(function () {
    var beforeUnloadHandler = function beforeUnloadHandler() {
      unloadingRef.current = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    return function () {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  return /*#__PURE__*/jsx("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state",
    children: !state || notLoggedIn ? null : /*#__PURE__*/jsx("div", {
      children: /*#__PURE__*/jsx(T, {
        id: "connectionState." + currentState
      })
    })
  });
}

export { ConnectionState as default };
//# sourceMappingURL=index-browser.es.js.map
