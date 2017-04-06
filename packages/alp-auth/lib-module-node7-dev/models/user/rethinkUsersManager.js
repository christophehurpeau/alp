import abstractUsersManager from './abstractUsersManager';
import { UserType as _UserType, AccountType as _AccountType } from './types/index';

import t from 'flow-runtime';
const UserType = t.tdz(() => _UserType);
const AccountType = t.tdz(() => _AccountType);
const mongoUsersManager = Object.create(abstractUsersManager);
export default mongoUsersManager;

Object.assign(mongoUsersManager, {
  findOneByAccountOrEmails(_arg) {
    const _returnType = t.return(t.nullable(t.ref(UserType)));

    let { provider, accountId, emails } = t.object(t.property('provider', t.string()), t.property('accountId', t.union(t.string(), t.number())), t.property('emails', t.nullable(t.array(t.string())))).assert(_arg);

    const r = this.store.r;
    let filter = r.row('accounts').contains(row => r.and(row('provider').eq(provider), row('accountId').eq(accountId)));

    if (emails && emails.length) {
      filter = r.or(filter, r.row('emails').contains(row => r.expr(emails).contains(row)));
    }

    let query = this.store.query().filter(filter);
    return this.store.findOne(query).then(_arg2 => _returnType.assert(_arg2));
  },

  updateAccount(user, account) {
    let _userType = t.ref(UserType);

    let _accountType = t.ref(AccountType);

    t.param('user', _userType).assert(user);
    t.param('account', _accountType).assert(account);

    let accountIndex = user.accounts.indexOf(account);
    if (accountIndex === -1) {
      throw new Error('Invalid account');
    }

    return this.store.partialUpdateOne(user, {
      accounts: this.store.r.row('accounts').changeAt(accountIndex, account)
    });
  }
});
//# sourceMappingURL=rethinkUsersManager.js.map