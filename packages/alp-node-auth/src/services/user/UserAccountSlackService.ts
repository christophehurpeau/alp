/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import type { Tokens } from "../authentification/types";
import type { AccountService, FullName } from "./types";

// https://api.slack.com/methods/users.identity

export default class UserAccountSlackService<ScopeKeys extends "login">
  implements AccountService<ScopeKeys>
{
  scopeKeyToScope: Record<ScopeKeys, string>;

  constructor(scopeKeyToScope: Record<Exclude<"login", ScopeKeys>, string>) {
    this.scopeKeyToScope = {
      ...scopeKeyToScope,
      login: "identity.basic identity.email identity.avatar",
    };
  }

  providerKey = "google";

  getProfile(tokens: Tokens): Promise<any> {
    // eslint-disable-next-line n/no-unsupported-features/node-builtins
    return fetch(
      `https://slack.com/api/users.identity?token=${tokens.accessToken}`,
    ).then((response) => response.json());
  }

  getId(profile: any): string | null {
    if (!profile?.team?.id || !profile.user?.id) {
      return null;
    }
    return `team:${profile.team.id as string};user:${
      profile.user.id as string
    }`;
  }

  getAccountName(profile: any): string | null | undefined {
    return profile.user.email;
  }

  getEmails(profile: any): string[] {
    return profile.user.email ? [profile.user.email] : [];
  }

  getDisplayName(profile: any): string | null | undefined {
    return profile.user.name;
  }

  getFullName(profile: any): FullName | null {
    return null;
  }

  getDefaultScope(newScope: string): string[] {
    return this.getScope(undefined, newScope);
  }

  getScope(oldScope: string[] | undefined, newScope: string): string[] {
    return !oldScope
      ? newScope.split(" ")
      : [...oldScope, ...newScope.split(" ")].filter(
          (item, i, ar) => ar.indexOf(item) === i,
        );
  }
}
