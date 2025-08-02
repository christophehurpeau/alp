import { AuthorizationCode, ClientCredentials } from "simple-oauth2";

export default function googleStrategy(config) {
  const options = {
    client: {
      id: config.get("google").clientId,
      secret: config.get("google").clientSecret,
    },
    auth: {
      tokenHost: "https://accounts.google.com",
      tokenPath: "/o/oauth2/token",
    },
  };
  const authOptions = {
    ...options,
    auth: {
      ...options.auth,
      authorizePath: "/o/oauth2/auth",
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
