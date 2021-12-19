import { create } from 'simple-oauth2';

export default function slackStrategy(config) {
  return {
    type: 'oauth2',
    oauth2: create({
      client: {
        id: config.get('slack').get('clientId'),
        secret: config.get('slack').get('clientSecret'),
      },
      auth: {
        tokenHost: 'https://slack.com',
        tokenPath: '/api/oauth.access',
        authorizePath: '/oauth/authorize',
      },
    }),
  };
}
