/* global fetch */
import EventEmitter from 'events';
import { Tokens } from '../authentification/types';

// https://api.slack.com/methods/users.identity

export default new class UserAccountSlackService extends EventEmitter {
  static scopeKeyToScope = {
    login: 'identity.basic identity.email identity.avatar',
  };

  providerKey = 'google';

  getProfile(tokens: Tokens) {
    console.log(tokens);
    return fetch(
      `https://slack.com/api/users.identity?token=${tokens.accessToken}`,
    ).then((response) => response.json());
  }

  isAccount(account: any, profile: any) {
    return (
      account.slackUserId === profile.user.id &&
      (account.teamUserId === profile.team.id || !account.teamUserId)
    );
  }

  getId(profile: any) {
    return `team:${profile.team.id};user:${profile.user.id}`;
  }

  getAccountName(profile: any) {
    return profile.user.email;
  }

  getEmails(profile: any) {
    console.log(profile);
    return [profile.user.email];
  }

  getDisplayName(profile: any) {
    return profile.user.name;
  }

  getFullName(profile: any) {
    return null;
  }

  getDefaultScope(newScope: string) {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope: string[] | undefined, newScope: string) {
    return !oldScope
      ? newScope.split(' ')
      : oldScope
          .concat(newScope.split(' '))
          .filter((item: any, i: any, ar: string[]) => ar.indexOf(item) === i);
  }
}();
