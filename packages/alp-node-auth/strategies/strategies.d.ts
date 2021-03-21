import { Config, SlackParams } from 'alp-types';
import { OAuthClient } from 'simple-oauth2';

export interface Strategy {
  type: 'oauth2';
  oauth2: OAuthClient<SlackParams>;
}

export default function createStrategy(config: Config): Strategy;
