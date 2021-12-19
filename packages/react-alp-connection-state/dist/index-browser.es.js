import React, { useContext, useRef, useEffect } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';

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
  return /*#__PURE__*/React.createElement("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state"
  }, !state || notLoggedIn ? null : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(T, {
    id: "connectionState." + currentState
  })));
}

export { ConnectionState as default };
//# sourceMappingURL=index-browser.es.js.map
