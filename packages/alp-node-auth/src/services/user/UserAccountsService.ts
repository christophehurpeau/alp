import { EventEmitter } from "node:events";
import { Logger } from "nightingale-logger";
import type MongoUsersManager from "../../MongoUsersManager";
import type { Account, AccountId, User, UserSanitized } from "../../types";
import type { AllowedStrategyKeys } from "../authentification/types";
import type { AccountService, TokensObject } from "./types";

const logger = new Logger("alp:auth:userAccounts");

export const STATUSES = {
  VALIDATED: "validated",
  DELETED: "deleted",
};

export default class UserAccountsService<
  StrategyKeys extends AllowedStrategyKeys,
  U extends User = User,
  USanitized extends UserSanitized = UserSanitized,
  // eslint-disable-next-line unicorn/prefer-event-target
> extends EventEmitter {
  private readonly strategyToService: Record<StrategyKeys, AccountService<any>>;

  usersManager: MongoUsersManager<U, USanitized>;

  constructor(
    usersManager: MongoUsersManager<U, USanitized>,
    strategyToService: Record<StrategyKeys, AccountService<any>>,
  ) {
    super();
    this.usersManager = usersManager;
    this.strategyToService = strategyToService;
  }

  getScope(
    strategy: StrategyKeys,
    scopeKey: string,
    user?: U,
    accountId?: AccountId,
  ): string {
    logger.debug("getScope", { strategy, userId: user?._id });
    const service = this.strategyToService[strategy];
    if (!service) {
      throw new Error("Strategy not supported");
    }

    const newScope = service.scopeKeyToScope[scopeKey];
    if (!user || !accountId) {
      return newScope;
    }
    const account = user.accounts.find(
      (account) =>
        account.provider === strategy && account.accountId === accountId,
    );

    if (!account) {
      throw new Error("Could not found associated account");
    }
    return service.getScope(account.scope, newScope).join(" ");
  }

  async update(
    user: U,
    strategy: StrategyKeys,
    tokens: TokensObject,
    scope: string,
    subservice: string,
  ): Promise<{ user: U; account: U["accounts"][number] }> {
    const service = this.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    const account = user.accounts.find(
      (account) =>
        account.provider === strategy && account.accountId === accountId,
    );
    if (!account) {
      // TODO check if already exists in other user => merge
      // TODO else add a new account in this user
      throw new Error("Could not found associated account");
    }
    account.status = "valid";
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate !== undefined) {
      account.tokenExpireDate = tokens.expireDate;
    }
    account.scope = service.getScope(account.scope, scope);
    account.subservices = account.subservices || [];
    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }

    await this.usersManager.replaceOne(user);
    return { user, account };
  }

  async findOrCreateFromStrategy(
    strategy: StrategyKeys,
    tokens: TokensObject,
    scope: string,
    subservice: string,
  ): Promise<U> {
    const service = this.strategyToService[strategy];
    if (!service) throw new Error("Strategy not supported");

    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    if (!accountId) throw new Error("Invalid profile: no id found");

    const emails = service.getEmails(profile);

    let user: Partial<U> | undefined =
      await this.usersManager.findOneByAccountOrEmails({
        provider: service.providerKey,
        accountId,
        emails,
      });

    logger.info(!user ? "create user" : "existing user", {
      userId: user?._id,
      accountId,
      /*emails , user*/
    });

    if (!user) {
      user = {};
    }

    Object.assign(user, {
      displayName: service.getDisplayName(profile),
      fullName: service.getFullName(profile),
      status: STATUSES.VALIDATED,
    });

    if (!user.accounts) user.accounts = [];

    let account: Partial<Account> | undefined = user.accounts.find(
      (account: Account) =>
        account.provider === strategy && account.accountId === accountId,
    );

    if (!account) {
      account = { provider: strategy, accountId };
      user.accounts.push(account as Account);
    }

    account.name = service.getAccountName(profile);
    account.status = "valid";
    account.profile = profile;
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate !== undefined) {
      account.tokenExpireDate = tokens.expireDate;
    }
    account.scope = service.getScope(account.scope, scope);

    if (!account.subservices) account.subservices = [];
    if (subservice && !account.subservices.includes(subservice)) {
      account.subservices.push(subservice);
    }

    if (!user.emails) user.emails = [];
    const userEmails = user.emails;
    emails.forEach((email: string) => {
      if (!userEmails.includes(email)) {
        userEmails.push(email);
      }
    });

    user.emailDomains = [
      // eslint-disable-next-line unicorn/no-array-reduce
      ...user.emails.reduce(
        (domains: Set<string>, email: string) =>
          domains.add(email.split("@", 2)[1]),
        new Set<string>(),
      ),
    ];

    const keyPath = this.usersManager.store.keyPath;

    if (user[keyPath]) {
      await this.usersManager.replaceOne(user as U);
    } else {
      await this.usersManager.insertOne(user as U);
    }

    return user as U;
  }

  async updateAccount(user: U, account: Account): Promise<U> {
    await this.usersManager.updateAccount(user, account);
    return user;
  }
}
