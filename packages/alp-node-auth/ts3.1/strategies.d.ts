import { Config, SlackParams } from 'alp-types';
import { OAuthClient } from 'simple-oauth2';

declare module 'alp-node-auth/strategies/dropbox' {
  export interface DropboxStrategy {
    type: 'oauth2';
    oauth2: OAuthClient;
  }

  export default function createDropboxStrategy(
    config: Config,
  ): DropboxStrategy;
}
declare module 'alp-node-auth/strategies/facebook' {
  export interface FacebookStrategy {
    type: 'oauth2';
    oauth2: OAuthClient;
  }

  export default function createFacebookStrategy(
    config: Config,
  ): FacebookStrategy;
}
declare module 'alp-node-auth/strategies/foursquare' {
  export interface FoursquareStrategy {
    type: 'oauth2';
    oauth2: OAuthClient;
  }

  export default function createFoursquareStrategy(
    config: Config,
  ): FoursquareStrategy;
}
declare module 'alp-node-auth/strategies/github' {
  export interface GithubStrategy {
    type: 'oauth2';
    oauth2: OAuthClient;
  }

  export default function createGithubStrategy(config: Config): GithubStrategy;
}
declare module 'alp-node-auth/strategies/google' {
  export interface GoogleStrategy {
    type: 'oauth2';
    oauth2: OAuthClient;
  }

  export default function createGoogleStrategy(config: Config): GoogleStrategy;
}
declare module 'alp-node-auth/strategies/slack' {
  export interface SlackStrategy {
    type: 'oauth2';
    oauth2: OAuthClient<SlackParams>;
  }

  export default function createSlackStrategy(config: Config): SlackStrategy;
}
