import EventEmitter from 'events';

export default new class UserAccountGoogleService extends EventEmitter {
    static scopeKeyToScope = {
        login: 'openid profile email https://www.googleapis.com/auth/plus.profile.emails.read',
    };

    providerKey = 'google';

    getProfile(tokens) {
        return fetch(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokens.accessToken}`)
            .then((response) => response.json());
    }

    isAccount(account, profile) {
        return account.googleId === profile.id;
    }

    getId(profile) {
        return profile.id;
    }

    getAccountName(profile) {
        return profile.email;
    }

    getEmails(profile, plusProfile) {
        const emails = [];

        if (profile.email) {
            emails.push(profile.email);
        }

        if (plusProfile.emails) {
            plusProfile.emails.forEach((email) => {
                if (emails.indexOf(email.value) === -1) {
                    emails.push(email.value);
                }
            });
        }

        return emails;
    }

    getDisplayName(profile) {
        return profile.name;
    }

    getFullName(profile) {
        return {
            givenName: profile.given_name,
            familyName: profile.family_name,
        };
    }

    getDefaultScope(newScope) {
        return this.getScope(newScope);
    }

    getScope(oldScope, newScope) {
        return !oldScope ? newScope.split(' ') : oldScope.concat(newScope.split(' '))
            .filter((item, i, ar) => ar.indexOf(item) === i);
    }
};
