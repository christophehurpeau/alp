var identityState = function identityState() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  return state;
};

function browser (app) {
  app.reduxReducers.user = identityState;
  app.reduxReducers.connected = identityState;
}

export default browser;
//# sourceMappingURL=index-browser.es.js.map
