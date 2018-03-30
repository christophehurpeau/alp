const identityState = (state = null) => state;

export default function(app) {
  app.reduxReducers.user = identityState;
  app.reduxReducers.connected = identityState;
}
