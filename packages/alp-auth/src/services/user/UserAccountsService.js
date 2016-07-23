/* global fetch */
import EventEmitter from 'events';
import Logger from 'nightingale-logger';
import UsersManager from '../../models/user/UsersManager';
import userAccountGoogleService from './userAccountGoogleService';

type TokensObject = {
    accessToken: string,
    refreshToken?: string,
};

const logger = new Logger('alp-auth.services.userAccounts');

export default class UserAccountsService extends EventEmitter {
    static strategyToService = {
        google: userAccountGoogleService,
    };

    constructor(usersManager: UsersManager) {
        super();
        this.usersManager = usersManager;
    }

    getScope(strategy: string, scopeKey: string, user, accountId) {
        logger.debug('getScope', { strategy, userId: user && user._id });
        const service = this.constructor.strategyToService[strategy];
        const newScope = service.constructor.scopeKeyToScope[scopeKey];
        if (!user || !accountId) {
            return newScope;
        }
        const account = user.accounts
            .find(account => account.provider === strategy && account.accountId === accountId);

        if (!account) {
            throw new Error('Could not found associated account');
        }
        return service.getScope(account.scope, newScope).join(' ');
    }

    async update(user, strategy, tokens, scope, subservice) {
        const service = this.constructor.strategyToService[strategy];
        const profile = await service.getProfile(tokens);
        const account = user.accounts
            .find(account => account.provider === strategy && service.isAccount(account, profile));
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

        await this.usersManager.update(user);
        return user;
    }

    /**
     * @param  {Object} profile
     * @param  {String} token
     * @param  {String} tokenSecret
     * @return {Promise}
     */
    async findOrCreateFromGoogle(strategy: string, tokens: TokensObject, scope: string, subservice) {
        if (strategy !== 'google') {
            throw new Error('Not supported at the moment');
        }

        const service = this.constructor.strategyToService[strategy];

        const profile = await service.getProfile(tokens);

        const plusProfile = await fetch(
            `https://www.googleapis.com/plus/v1/people/me?access_token=${tokens.accessToken}`
        ).then((response) => response.json());

        const emails = service.getEmails(profile, plusProfile);


        let user = await this.usersManager.findOneByAccountOrEmails({
            provider: service.providerKey,
            accountId: service.getId(profile),
            emails,
        });

        if (!user) {
            user = {};
        }

        Object.assign(user, {
            displayName: service.getDisplayName(profile),
            fullName: service.getFullName(profile),
            status: this.usersManager.STATUSES.VALIDATED,
        });

        if (!user.accounts) user.accounts = [];

        const accountId = service.getId(profile);

        let account = user.accounts.find(account => (
            account.provider === strategy && account.accountId === accountId
        ));

        if (!account) {
            account = { provider: strategy, accountId: accountId };
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
        emails.forEach((email) => {
            if (!userEmails.includes(email)) {
                userEmails.push(email);
            }
        });

        await this.usersManager[user._id ? 'updateOne' : 'insertOne'](user);
        return user;
    }

    updateAccount(user, account) {
        return this.usersManager.updateAccount(user, account).then(() => user);
    }
}
