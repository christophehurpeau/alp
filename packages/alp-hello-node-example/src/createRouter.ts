import type { Context } from 'alp-node';
import { config } from 'alp-node';
import type { AuthRoutes } from 'alp-node-auth';
import type { Router } from 'router-segments';
import { createRouterBuilder } from 'router-segments';

type Locales = 'en' | 'fr';

export default function createRouter({
  auth,
}: {
  auth: AuthRoutes;
}): Router<Locales> {
  const builder = createRouterBuilder();

  const redirectToHome = (ctx: Context): void => {
    ctx.redirect(`${config.get<string>('webappUrl')}/auth`);
  };

  builder.add('/', redirectToHome);

  // builder.addSegment('/api', (apiSegment) => {
  //   const authSegment = apiSegment;
  //   // apiSegment.addSegment('/auth', (authSegment) => {
  //   authSegment.addSegment(...auth.login);
  //   authSegment.add(...auth.addScope);
  //   authSegment.add(...auth.logout);
  //   // });

  //   apiSegment.defaultRoute(redirectToHome);
  // });

  builder.addSegment(...auth.login);
  builder.add(...auth.addScope);
  builder.add(...auth.logout);

  return builder.createRouter();
}
