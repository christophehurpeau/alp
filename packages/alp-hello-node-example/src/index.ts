// eslint-disable-next-line import-x/no-unresolved
import Alp, { router } from "alp-node";
// eslint-disable-next-line import-x/no-unresolved
import authInit, { UserAccountSlackService } from "alp-node-auth";
import slackStrategy from "alp-node-auth/strategies/slack";
// eslint-disable-next-line import-x/no-unresolved
import { addConfig, appLogger } from "nightingale-app-console";
// eslint-disable-next-line import-x/no-unresolved
import webProcessor from "nightingale-web-processor";
import createRouter from "./createRouter";
import type { User } from "./db/user";
import { usersManager } from "./db/user";

declare module "alp-node" {
  interface BaseContext {
    logger: typeof appLogger;
  }
}

const app = new Alp();

const auth = authInit<"slack", User>({
  usersManager,
  strategies: { slack: slackStrategy(app.config) },
  strategyToService: {
    slack: new UserAccountSlackService({}),
  },
  defaultStrategy: "slack",
  jwtAudience: "hello-node-example",
})(app);

addConfig(
  {
    processors: [webProcessor],
  },
  true,
);
await app.start(() => {
  app.use((ctx, next) => {
    ctx.logger = appLogger.context({ request: ctx.req });
    return next();
  });
  app.use((ctx, next) => {
    ctx.logger.info("Request");
    return next();
  });
  app.catchErrors();
  app.use(auth.middleware);
  app.use(router(createRouter({ auth: auth.routes }))(app));
});
