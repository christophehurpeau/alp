import { AuthorizationCode, ClientCredentials } from "simple-oauth2";

export default function dropboxStrategy(config) {
  const options = {
    client: {
      id: config.get("dropbox").get("clientId"),
      secret: config.get("dropbox").get("clientSecret"),
    },
    auth: {
      tokenHost: "https://www.dropbox.com",
      tokenPath: "/1/oauth2/token",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/1/oauth2/authorize",
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
