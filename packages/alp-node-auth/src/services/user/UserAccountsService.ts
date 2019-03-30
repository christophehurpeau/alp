import EventEmitter from 'events';
import Logger from 'nightingale-logger';
import { AccountId, User, Account } from '../../../types.d';
import MongoUsersManager from '../../MongoUsersManager';
import userAccountGoogleService from './userAccountGoogleService';
import userAccountSlackService from './userAccountSlackService';

interface TokensObject {
  accessToken: string;
  expireDate: Date;
  idToken: string;
  refreshToken?: string;
  tokenType: string;
}

const logger = new Logger('alp:auth:userAccounts');

export const STATUSES = {
  VALIDATED: 'validated',
  DELETED: 'deleted',
};

export default class UserAccountsService extends EventEmitter {
  static strategyToService: { [key: string]: any } = {
    google: userAccountGoogleService,
    slack: userAccountSlackService,
  };

  usersManager: MongoUsersManager;

  constructor(usersManager: MongoUsersManager) {
    super();
    this.usersManager = usersManager;
  }

  getScope(
    strategy: string,
    scopeKey: string,
    user?: User,
    accountId?: AccountId,
  ) {
    logger.debug('getScope', { strategy, userId: user && user._id });
    const service = UserAccountsService.strategyToService[strategy];
    if (!service) {
      throw new Error('Strategy not supported');
    }

    const newScope = service.constructor.scopeKeyToScope[scopeKey];
    if (!user || !accountId) {
      return newScope;
    }
    const account = user.accounts.find(
      (account) =>
        account.provider === strategy && account.accountId === accountId,
    );

    if (!account) {
      throw new Error('Could not found associated account');
    }
    return service.getScope(account.scope, newScope).join(' ');
  }

  async update(
    user: User,
    strategy: string,
    tokens: TokensObject,
    scope: string,
    subservice: string,
  ) {
    const service = UserAccountsService.strategyToService[strategy];
    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    const account = user.accounts.find(
      (account) =>
        account.provider === strategy && account.accountId === accountId,
    );
    if (!account) {
      // TODO check if already exists in other user => merge
      // TODO else add a new account in this user
      throw new Error('Could not found associated account');
    }
    account.status = 'valid';
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate) {
      account.tokenExpireDate = tokens.expireDate;
    }
    account.scope = service.getScope(account.scope, scope);
    account.subservices = account.subservices || [];
    if (subservice && account.subservices.indexOf(subservice) === -1) {
      account.subservices.push(subservice);
    }

    await this.usersManager.replaceOne(user);
    return user;
  }

  async findOrCreateFromStrategy(
    strategy: string,
    tokens: TokensObject,
    scope: string,
    subservice: string,
  ): Promise<User> {
    const service = UserAccountsService.strategyToService[strategy];
    if (!service) throw new Error('Strategy not supported');

    const profile = await service.getProfile(tokens);
    const accountId = service.getId(profile);
    if (!accountId) throw new Error('Invalid profile: no id found');

    const emails = service.getEmails(profile);

    let user:
      | Partial<User>
      | undefined = await this.usersManager.findOneByAccountOrEmails({
      provider: service.providerKey,
      accountId,
      emails,
    });

    logger.info(!user ? 'create user' : 'existing user', { emails, user });

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
      // @ts-ignore
      user.accounts.push(account);
    }

    account.name = service.getAccountName(profile);
    account.status = 'valid';
    account.profile = profile;
    account.accessToken = tokens.accessToken;
    if (tokens.refreshToken) {
      account.refreshToken = tokens.refreshToken;
    }
    if (tokens.expireDate) {
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
      ...user.emails.reduce(
        (domains: Set<string>, email: string) =>
          domains.add(email.split('@', 2)[1]),
        new Set<string>(),
      ),
    ];

    const keyPath: string = this.usersManager.store.keyPath;

    if (user[keyPath]) {
      await this.usersManager.replaceOne(user as User);
    } else {
      await this.usersManager.insertOne(user as User);
    }

    return user as User;
  }

  async updateAccount(user: User, account: Account): Promise<User> {
    await this.usersManager.updateAccount(user, account);
    return user;
  }
}
