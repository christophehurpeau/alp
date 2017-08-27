function identityState(state) {
  return state || null;
}

module.exports = function(app) {
  app.reduxReducers.user = identityState;
  app.reduxReducers.connected = identityState;
};
