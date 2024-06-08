import { ClientCredentials, AuthorizationCode } from "simple-oauth2";

export default function foursquareStrategy(config) {
  const options = {
    client: {
      id: config.get("foursquare").get("clientId"),
      secret: config.get("foursquare").get("clientSecret"),
    },
    auth: {
      tokenHost: "https://foursquare.com",
      tokenPath: "/oauth2/access_token",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/oauth2/authenticate",
    },
  };
  return {
    type: "oauth2",
    oauth2: {
      authorizationCode: new AuthorizationCode(authOptions),
      clientCredentials: new ClientCredentials(options),
    },
  };
}
