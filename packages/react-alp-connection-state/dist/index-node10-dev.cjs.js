'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);
const ReactAlpContext = _interopDefault(require('react-alp-context'));
const reactAlpTranslate = require('react-alp-translate');

function ConnectionState({
  state
}) {
  const ctx = React.useContext(ReactAlpContext);
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
//# sourceMappingURL=index-node10-dev.cjs.js.map
