import { ClientCredentials, AuthorizationCode } from "simple-oauth2";

export default function slackStrategy(config) {
  const options = {
    client: {
      id: config.get("slack").get("clientId"),
      secret: config.get("slack").get("clientSecret"),
    },
    auth: {
      tokenHost: "https://slack.com",
      tokenPath: "/api/oauth.access",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/oauth/authorize",
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
