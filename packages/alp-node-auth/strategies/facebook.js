import { ClientCredentials, AuthorizationCode } from "simple-oauth2";

export default function facebookStrategy(config) {
  const options = {
    client: {
      id: config.get("facebook").get("clientId"),
      secret: config.get("facebook").get("clientSecret"),
    },
    auth: {
      tokenHost: "https://www.facebook.com",
      tokenPath: "/oauth/access_token",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/dialog/oauth",
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
