'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');
const ReactAlpContext = require('react-alp-context');
const reactAlpTranslate = require('react-alp-translate');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const React__default = /*#__PURE__*/_interopDefaultLegacy(React);
const ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);

function ConnectionState({
  state
}) {
  const ctx = React.useContext(ReactAlpContext__default);
  const notLoggedIn = !ctx.sanitizedState.user;
  const unloadingRef = React.useRef(false);
  const currentStateRef = React.useRef(state);

  if (unloadingRef.current === false) {
    currentStateRef.current = state;
  }

  const currentState = currentStateRef.current;
  React.useEffect(() => {
    const beforeUnloadHandler = () => {
      unloadingRef.current = true;
    };

    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);
  return /*#__PURE__*/React__default.createElement("div", {
    hidden: !state || notLoggedIn || currentState === 'connected',
    className: "alp-connection-state"
  }, !state || notLoggedIn ? null : /*#__PURE__*/React__default.createElement("div", null, /*#__PURE__*/React__default.createElement(reactAlpTranslate.T, {
    id: `connectionState.${currentState}`
  })));
}

exports.default = ConnectionState;
//# sourceMappingURL=index-node12.cjs.js.map
