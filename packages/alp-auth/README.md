# alp-auth [![NPM version][npm-image]][npm-url]

Authentication with alp

[![Dependency Status][daviddm-image]][daviddm-url]

## Install

```sh
npm install --save alp-auth
```

## What it does

- Provides route and controller to login user
- Provides extandable services and managers
- Provides authentication middleware: `context.state.connected` and `context.state.user`

## How to use

> config/local.yml

```yml
server:
    google:
        clientId: xxxx
        clientSecret: xxxx

```

> models/user/usersManager.server.js

```js
import MongoStore from '../../db/mongo';
import { UsersManager } from 'alp-auth';

export default new UsersManager(new MongoStore('users'));
```

> index.server.js

```js
import Alp from 'alp-node';
import 'alp-node/fetch';
import authInit from 'alp-auth';
import googleStrategy from 'alp-auth/strategies/google';
import * as loginModuleDescriptor from './modules/auth/login';
import usersManager from './models/user/usersManager.server';

const app = new Alp(...);

// config / init
const authMiddleware = authInit({
   controllers,
   usersManager,
   strategies: { google: googleStrategy(config) },
   loginModuleDescriptor,
})(app);

// middlewares
app.use(authMiddleware);
```

> routerBuilder.js

```js
import { routes as authRoutes } from 'alp-auth';

export default function buildRouter(builder) {
    builder
        .add('home', '/', 'home.index')
        .add(...authRoutes.login)
        .add(...authRoutes.logout)
        .addDefaultRoutes();
}
````

> modules/auth/login/index.js

```js
export const identifier = 'login';
export { default as View } from './LoginView';
```

> modules/auth/login/LoginView.js

```js
import React, { PropTypes } from 'react';
import Header from '../components/HeaderComponent';
import { LoginButtons } from 'react-alp-login';

IndexView.contextTypes = {
    setTitle: PropTypes.func.isRequired,
    context: PropTypes.object.isRequired,
};

export default function IndexView(props, { setTitle, context }) {
    return (<div>
        <Helmet
            title={`${context.t('title')} - ${context.t('login.title')}`}
        />
        <Header />
        <LoginButtons />
    </div>);
}
```

> modules/common/components/HeaderUserComponent.js

```js
import { PropTypes } from 'react';
import Link from 'react-alp-link';

HeaderUserComponent.contextTypes = {
    context: PropTypes.object,
};

export default function HeaderUserComponent(props, { context: { state: { user } } }) {
    if (user) {
        return (<div className="dropdown">
            {user.displayName}
            <ul className="list links">
                <li><Link to="default" params={{ action: 'logout' }} target="_self">Logout</Link></li>
            </ul>
        </div>);
    }

    return (<div>
        <Link to="default" params={{ action: 'login' }}>Login</Link>
    </div>);
}
```


[npm-image]: https://img.shields.io/npm/v/alp-auth.svg?style=flat-square
[npm-url]: https://npmjs.org/package/alp-auth
[daviddm-image]: https://david-dm.org/alpjs/alp-auth.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/alpjs/alp-auth
