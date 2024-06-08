import { ClientCredentials, AuthorizationCode } from "simple-oauth2";

export default function githubStrategy(config) {
  const options = {
    client: {
      id: config.get("github").get("clientId"),
      secret: config.get("github").get("clientSecret"),
    },
    auth: {
      tokenHost: "https://github.com",
      tokenPath: "/login/oauth/access_token",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/login/oauth/authorize",
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
