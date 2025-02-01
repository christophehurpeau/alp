import type { IncomingMessage } from "node:http";
import type { NodeConfig } from "alp-node";
import { Logger } from "nightingale-logger";
import type MongoUsersManager from "./MongoUsersManager";
import type { User } from "./types";
import { COOKIE_NAME_TOKEN, getTokenFromRequest } from "./utils/cookies";
import { createFindLoggedInUser } from "./utils/createFindLoggedInUser";

const logger = new Logger("alp:auth");

const getTokenFromReq = (
  req: IncomingMessage & { cookies?: Record<string, string> },
): string | undefined => {
  if (req.cookies) return req.cookies[COOKIE_NAME_TOKEN];
  return getTokenFromRequest(req);
};

/*
 * Not tested yet.
 * @internal
 */
export const createAuthApolloContext = <U extends User = User>(
  config: NodeConfig,
  usersManager: MongoUsersManager<U>,
): any => {
  const findLoggedInUser = createFindLoggedInUser(
    config.get<Map<string, string>>("authentication").get("secretKey")!,
    usersManager,
    logger,
  );

  return async ({ req, connection }: { req: any; connection: any }) => {
    if (connection?.loggedInUser) {
      return { user: connection.loggedInUser };
    }

    if (!req) return null;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const token = getTokenFromReq(req);

    if (!token) return { user: undefined };

    const [, loggedInUser] = await findLoggedInUser(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      req.headers["user-agent"],
      token,
    );

    return { user: loggedInUser };
  };
};
