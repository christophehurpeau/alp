import { AuthorizationCode, ClientCredentials } from "simple-oauth2";

export default function githubStrategy(config) {
  const options = {
    client: {
      id: config.get("github").clientId,
      secret: config.get("github").clientSecret,
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
