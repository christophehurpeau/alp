export default {
    login: [
        '/login[/${strategy}]',
        segment => {
            segment
                .add('loginResponse', '/response', 'auth.loginResponse')
                .defaultRoute('login', 'auth.login');
        },
    ],
    logout: [
        'logout',
        '/logout',
        'auth.logout',
    ],
};
