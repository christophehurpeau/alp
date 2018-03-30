const identityState = function identityState(state = null) {
  return state;
};

function browser (app) {
  app.reduxReducers.user = identityState;
  app.reduxReducers.connected = identityState;
}

export default browser;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
