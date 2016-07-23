export var UserNameType = function () {
    function UserNameType(input) {
        return input != null && typeof input.givenName === 'string' && typeof input.familyName === 'string';
    }

    ;
    Object.defineProperty(UserNameType, Symbol.hasInstance, {
        value: function value(input) {
            return UserNameType(input);
        }
    });
    return UserNameType;
}();

export var AccountType = function () {
    function AccountType(input) {
        return input != null && typeof input.provider === 'string' && typeof input.accountId === 'string' && typeof input.name === 'string' && typeof input.status === 'string' && typeof input.accessToken === 'string' && input.tokenExpireDate instanceof Date && (input.refreshToken === undefined || typeof input.refreshToken === 'string') && (input.profile === undefined || input.profile instanceof Object) && Array.isArray(input.scope) && input.scope.every(function (item) {
            return typeof item === 'string';
        });
    }

    ;
    Object.defineProperty(AccountType, Symbol.hasInstance, {
        value: function value(input) {
            return AccountType(input);
        }
    });
    return AccountType;
}();

export var UserType = function () {
    function UserType(input) {
        return input != null && typeof input.displayName === 'string' && UserNameType(input.fullName) && typeof input.status === 'string' && Array.isArray(input.emails) && input.emails.every(function (item) {
            return typeof item === 'string';
        }) && Array.isArray(input.accounts) && input.accounts.every(function (item) {
            return AccountType(item);
        });
    }

    ;
    Object.defineProperty(UserType, Symbol.hasInstance, {
        value: function value(input) {
            return UserType(input);
        }
    });
    return UserType;
}();

export var AccountBrowserType = function () {
    function AccountBrowserType(input) {
        return input != null && typeof input.provider === 'string' && typeof input.accountId === 'string' && typeof input.name === 'string' && typeof input.status === 'string';
    }

    ;
    Object.defineProperty(AccountBrowserType, Symbol.hasInstance, {
        value: function value(input) {
            return AccountBrowserType(input);
        }
    });
    return AccountBrowserType;
}();

export var UserBrowserType = function () {
    function UserBrowserType(input) {
        return input != null && typeof input.displayName === 'string' && UserNameType(input.fullName) && typeof input.status === 'string' && Array.isArray(input.emails) && input.emails.every(function (item) {
            return typeof item === 'string';
        }) && Array.isArray(input.accounts) && input.accounts.every(function (item) {
            return AccountBrowserType(item);
        });
    }

    ;
    Object.defineProperty(UserBrowserType, Symbol.hasInstance, {
        value: function value(input) {
            return UserBrowserType(input);
        }
    });
    return UserBrowserType;
}();
//# sourceMappingURL=index.js.map