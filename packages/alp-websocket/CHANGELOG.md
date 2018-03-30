<a name="4.0.2"></a>
## [4.0.2](https://github.com/alpjs/alp-websocket/compare/v4.0.1...v4.0.2) (2018-03-30)


<a name="4.0.1"></a>
## [4.0.1](https://github.com/alpjs/alp-websocket/compare/v4.0.0...v4.0.1) (2017-08-27)


### Bug Fixes

* socket connected before redux store created ([b9c93e1](https://github.com/alpjs/alp-websocket/commit/b9c93e1))


<a name="4.0.0"></a>
# [4.0.0](https://github.com/alpjs/alp-websocket/compare/v3.13.0...v4.0.0) (2017-08-27)


### Features

* breaking change: socket.io 2.0 ([5beec54](https://github.com/alpjs/alp-websocket/commit/5beec54))
* move middleware from alp-react-redux to here ([942a37d](https://github.com/alpjs/alp-websocket/commit/942a37d))
* use app.reduxReducers ([7f9f22f](https://github.com/alpjs/alp-websocket/commit/7f9f22f))


<a name="3.13.0"></a>
# [3.13.0](https://github.com/alpjs/alp-websocket/compare/v3.12.0...v3.13.0) (2017-08-16)


### Features

* update dependencies, change websocket state ([84f93ef](https://github.com/alpjs/alp-websocket/commit/84f93ef))


<a name="3.12.0"></a>
# [3.12.0](https://github.com/alpjs/alp-websocket/compare/v3.11.3...v3.12.0) (2017-07-26)


### Features

* alp reducer websocket state ([2e2baad](https://github.com/alpjs/alp-websocket/commit/2e2baad))


<a name="3.11.3"></a>
## [3.11.3](https://github.com/alpjs/alp-websocket/compare/v3.11.2...v3.11.3) (2017-05-15)


### Bug Fixes

* revert socket.io to 1.7.3 ([9ecdbc4](https://github.com/alpjs/alp-websocket/commit/9ecdbc4))


<a name="3.11.2"></a>
## [3.11.2](https://github.com/alpjs/alp-websocket/compare/v3.11.1...v3.11.2) (2017-05-10)


### Bug Fixes

* call callback on unsubscribe when socket disconnects ([dab8f45](https://github.com/alpjs/alp-websocket/commit/dab8f45))


<a name="3.11.1"></a>
## [3.11.1](https://github.com/alpjs/alp-websocket/compare/v3.11.0...v3.11.1) (2017-04-01)


### Bug Fixes

* flow-runtime missing Promise return type ([502ab83](https://github.com/alpjs/alp-websocket/commit/502ab83))


<a name="3.11.0"></a>
# [3.11.0](https://github.com/alpjs/alp-websocket/compare/v3.10.0...v3.11.0) (2017-03-05)


### Features

* pob upgrade ([0038c84](https://github.com/alpjs/alp-websocket/commit/0038c84))


<a name="3.10.0"></a>
# [3.10.0](https://github.com/alpjs/alp-websocket/compare/v3.9.0...v3.10.0) (2016-12-22)


<a name="3.9.0"></a>
# [3.9.0](https://github.com/alpjs/alp-websocket/compare/v3.8.0...v3.9.0) (2016-12-22)


### Features

* transform error from websocket into Error instance if string ([5504f1e](https://github.com/alpjs/alp-websocket/commit/5504f1e))


### v3.8.0

- [`4554910`](https://github.com/alpjs/alp-websocket/commit/4554910887fb4344bd59b0497a9a012a99f2d499) refactor: on hello, if version mismatch warn instead of reload (Christophe Hurpeau)

### v3.7.0

- [`6597764`](https://github.com/alpjs/alp-websocket/commit/6597764f322f20359a81334a7f591c0c931bf290) refactor: pob update and update dependencies (Christophe Hurpeau)

### v3.6.0

- [`c3626b4`](https://github.com/alpjs/alp-websocket/commit/c3626b4d46f33cc73ad1650d7b0b80921b80d043) feat: use app.certpath (Christophe Hurpeau)

### v3.5.0

- [`3bad4a3`](https://github.com/alpjs/alp-websocket/commit/3bad4a32eeb71f0711bed4db3f813bdb28961c21) chore(package): nightingale-logger@^1.6.0 (Christophe Hurpeau)

### v3.4.0

- [`7b293d5`](https://github.com/alpjs/alp-websocket/commit/7b293d5f068bd6311fdc36811492f776e137d917) chore: pob update (Christophe Hurpeau)
- [`a53399a`](https://github.com/alpjs/alp-websocket/commit/a53399a9842ca8013d6c60a16e5cfd21246d0c55) feat: add callbackonunsubscribe (Christophe Hurpeau)

### v3.3.2

- [`04e9a7e`](https://github.com/alpjs/alp-websocket/commit/04e9a7e38fa80180488e09b93c42abca97ff2371) app.websocket = websocket instead of socket (emits returns a Promise) (Christophe Hurpeau)

### v3.3.1

- [`fdafd6b`](https://github.com/alpjs/alp-websocket/commit/fdafd6b340fafa0298a59401e672ca461df22e7d) browser app.websocket (Christophe Hurpeau)

### v3.3.0

- [`8f36fc8`](https://github.com/alpjs/alp-websocket/commit/8f36fc80f40ca03929cbf12e323afaa6d7802d5a) close websocket (Christophe Hurpeau)

### v3.2.0

- [`509172b`](https://github.com/alpjs/alp-websocket/commit/509172bf662b16bf46a0510d1ab98ecb7048bc52) fix: keep internal connected state (Christophe Hurpeau)
- [`2921337`](https://github.com/alpjs/alp-websocket/commit/2921337ee8dce7bfc2ebdfe0f4428c40bc239e32) chore: dependencies (Christophe Hurpeau)
- [`6ba39bb`](https://github.com/alpjs/alp-websocket/commit/6ba39bb8d065320ad9aceabcd4fdfb5c2acce769) build (Christophe Hurpeau)

### v3.1.0

- [`89954f5`](https://github.com/alpjs/alp-websocket/commit/89954f5128540fb2609af2e664c66e6c7f7f7c79) remove duplicate npm run build (Christophe Hurpeau)
- [`964031c`](https://github.com/alpjs/alp-websocket/commit/964031c60d39ebd231cb19c7ec80409f3a38978b) pob update (Christophe Hurpeau)

### v3.0.2

- [`9f8d130`](https://github.com/alpjs/alp-websocket/commit/9f8d1305ab4cb13372a0a2f3f66008e0ecea0501) fix error and update dependencies (Christophe Hurpeau)

### v3.0.1

- [`3185924`](https://github.com/alpjs/alp-websocket/commit/3185924e5ca996bc535b7771c0002f014b26834b) throw error instead of string for timeout (Christophe Hurpeau)

### v3.0.0

- [`ee1a7cd`](https://github.com/alpjs/alp-websocket/commit/ee1a7cd8751244f9b12851e1ceb0499efe1e9dd1) emit callback first arg is now an error, and second is the result (Christophe Hurpeau)

### v2.1.0

- [`d621259`](https://github.com/alpjs/alp-websocket/commit/d621259ecb85858a358a6b7b9ce4b280f232e9cf) browser isConnected, node subscribe events (Christophe Hurpeau)

### v2.0.0

- [`df92d6b`](https://github.com/alpjs/alp-websocket/commit/df92d6bf1c703b8dddeb643fe6b011ac5be3d9a6) emit returns a promise, update dependencies, breaking: dirname is required for ssl (Christophe Hurpeau)

### v1.3.0

- [`ddd7296`](https://github.com/alpjs/alp-websocket/commit/ddd72961c52daf2a4f337c5c91b36d8c0eab9d03) change log connected/disconnected from info level to debug level (Christophe Hurpeau)

### v1.2.0

- [`90b2de2`](https://github.com/alpjs/alp-websocket/commit/90b2de2a36261980bb7cfe01382c3527d91be22b) browser namespace name (Christophe Hurpeau)

### v1.1.0

- [`1f1bf3f`](https://github.com/alpjs/alp-websocket/commit/1f1bf3f708ca59cb3dab7aa8e1a5ada1f1f20566) readme (Christophe Hurpeau)
- [`ee1a21f`](https://github.com/alpjs/alp-websocket/commit/ee1a21fd264c7d8bb3695ab97e2df57e953e495b) nightingale-logger (Christophe Hurpeau)

### v1.0.2

- [`2eac293`](https://github.com/alpjs/alp-websocket/commit/2eac29373dfce7ff40a9dc80a4b012f222aa4c8d) fix browser build (Christophe Hurpeau)

### v1.0.1
