<a name="0.35.0"></a>
# [0.35.0](https://github.com/alpjs/alp-node/compare/v0.34.0...v0.35.0) (2017-08-26)


### Features

* remove initialBrowserContext ([be7e039](https://github.com/alpjs/alp-node/commit/be7e039))


### BREAKING CHANGES

* initialBrowserContext


<a name="0.34.0"></a>
# [0.34.0](https://github.com/alpjs/alp-node/compare/v0.33.0...v0.34.0) (2017-08-16)


### Features

* update dependencies, remove alp-controller ([6648362](https://github.com/alpjs/alp-node/commit/6648362))


<a name="0.33.0"></a>
# [0.33.0](https://github.com/alpjs/alp-node/compare/v0.32.1...v0.33.0) (2017-07-26)


### Features

* node 8 ([66d3155](https://github.com/alpjs/alp-node/commit/66d3155))


### BREAKING CHANGES

* upgrade to node 8


<a name="0.32.1"></a>
## [0.32.1](https://github.com/alpjs/alp-node/compare/v0.32.0...v0.32.1) (2017-04-23)


### Bug Fixes

* call deprecated packageDirname ([503ab1e](https://github.com/alpjs/alp-node/commit/503ab1e))


<a name="0.32.0"></a>
# [0.32.0](https://github.com/alpjs/alp-node/compare/v0.31.0...v0.32.0) (2017-04-03)


### Features

* update dependencies ([633b657](https://github.com/alpjs/alp-node/commit/633b657))


<a name="0.31.0"></a>
# [0.31.0](https://github.com/alpjs/alp-node/compare/v0.30.0...v0.31.0) (2017-02-27)


### Features

* look for build config ([7fc2862](https://github.com/alpjs/alp-node/commit/7fc2862))


<a name="0.30.0"></a>
# [0.30.0](https://github.com/alpjs/alp-node/compare/v0.29.0...v0.30.0) (2017-02-27)

node 7


<a name="0.29.0"></a>
# [0.29.0](https://github.com/alpjs/alp-node/compare/v0.28.0...v0.29.0) (2017-02-06)


### Features

* pob-babel@14.1 and webpack node6 ([bf7d8f2](https://github.com/alpjs/alp-node/commit/bf7d8f2))


<a name="0.28.0"></a>
# [0.28.0](https://github.com/alpjs/alp-node/compare/v0.27.0...v0.28.0) (2017-02-04)


### Features

* upgrade dependencies ([aa88937](https://github.com/alpjs/alp-node/commit/aa88937))


### v0.27.0

- [`6cc0cd0`](https://github.com/alpjs/alp-node/commit/6cc0cd05f36dc426a64e4e5cb903374f4a33fb77) chore(package): update dependencies (Christophe Hurpeau)

### v0.26.0

- [`d2cd4c5`](https://github.com/alpjs/alp-node/commit/d2cd4c5a1a78315dc082301eef251be12262f4ce) chore(package): remove liwi in devDependencies (Christophe Hurpeau)
- [`09dacd0`](https://github.com/alpjs/alp-node/commit/09dacd00ca3fa5a3f9bc5e3fae0303c6a4d1477e) chore(package): update dependencies (Christophe Hurpeau)

### v0.25.0

- [`768bab0`](https://github.com/alpjs/alp-node/commit/768bab0a524f7ff9359382bfbf2feef825dcad64) update dependencies (Christophe Hurpeau)

### v0.24.0

- [`fe07086`](https://github.com/alpjs/alp-node/commit/fe07086e46380c0a7aaf3537a77aa83331e5854e) chore(package): update dependencies (Christophe Hurpeau)

### v0.23.0

BREAKING

replace

```js
app.migrate(migrationsManager)
```

by

```js
import migrate from 'alp-migrations/src';

migrate({ app, migrationsManager });
```

- [`fb6b74d`](https://github.com/alpjs/alp-node/commit/fb6b74da1fd8e3881e9fe62929db717a2c6c0217) refactor: logger.debug app and package dirnames (Christophe Hurpeau)
- [`6996941`](https://github.com/alpjs/alp-node/commit/6996941cbf56bbcdb3db98d78b71b027e647662e) refactor: remove alp-migrations (Christophe Hurpeau)
- [`89b8de4`](https://github.com/alpjs/alp-node/commit/89b8de427ee9118aad81185b1de0ebffbca00fc9) undefined (Christophe Hurpeau)


### v0.22.0

- [`6b570b5`](https://github.com/alpjs/alp-node/commit/6b570b51ec0d99ec99dfdc43e949fb17b6b39545) chore: add komet (Christophe Hurpeau)
- [`43e10c1`](https://github.com/alpjs/alp-node/commit/43e10c115387b727fc55cffc5e52a0d81733a9de) refactor: dirname uses process.argv[1] (Christophe Hurpeau)
- [`1d2a536`](https://github.com/alpjs/alp-node/commit/1d2a536b8625ae1c2911ca0bd50fec1069edbd1a) refactor: breaking: config and options (Christophe Hurpeau)

### v0.21.0

- [`7e819f2`](https://github.com/alpjs/alp-node/commit/7e819f2052454d382198e01423f9f461d0cacece) options.dirname and findup package.json (Christophe Hurpeau)
- [`d2bbf6c`](https://github.com/alpjs/alp-node/commit/d2bbf6c92c0ddea5d5b50f60c37bd98d90eaa42d) normalize options.dirname (Christophe Hurpeau)

### v0.20.0

- [`659afc1`](https://github.com/alpjs/alp-node/commit/659afc16c56fa8f143b1beb9f1fd37eb4435728c) add start method (Christophe Hurpeau)

### v0.19.1

- [`82e4f78`](https://github.com/alpjs/alp-node/commit/82e4f78896664be830211867d90bbfbff0f37985) update dependencies (Christophe Hurpeau)

### v0.19.0

- [`3f406e2`](https://github.com/alpjs/alp-node/commit/3f406e28054156b12b3e6e4bdfd61e4fd12ab4c1) close server (Christophe Hurpeau)

### v0.18.0

- [`1b32856`](https://github.com/alpjs/alp-node/commit/1b328565ffd54237e4fcb1a75838622aca072424) update dependencies (Christophe Hurpeau)

### v0.17.1

- [`8f91262`](https://github.com/alpjs/alp-node/commit/8f912624e8f5d2d032604b2fb98687522886232d) use dirname/migrations (Christophe Hurpeau)
- [`e88a376`](https://github.com/alpjs/alp-node/commit/e88a3767a386f939a1ce71d4677bc598de3d0dc2) update dependencies (Christophe Hurpeau)

### v0.17.0

- [`96aa261`](https://github.com/alpjs/alp-node/commit/96aa2618d22fbf74377a884a173122e6d5e738f9) update dependencies (Christophe Hurpeau)

### v0.16.0

- [`607f2b4`](https://github.com/alpjs/alp-node/commit/607f2b4e0e8aaa0a31ab55d65cca71817b80d228) remove alp-limosa (Christophe Hurpeau)

### v0.15.0

- [`ff7ec6b`](https://github.com/alpjs/alp-node/commit/ff7ec6beea6164a62253be51a3e94c53472a311e) alp-params (Christophe Hurpeau)

### v0.14.0

- [`e9bf768`](https://github.com/alpjs/alp-node/commit/e9bf76832f1a8bf8feea71b5534a1903f749f6f4) update dependencies (Christophe Hurpeau)

### v0.13.0

- [`47be0cb`](https://github.com/alpjs/alp-node/commit/47be0cbc6d81534ebb6ed0c7631234a3c31c55d6) breaking: computeInitialContextForBrowser, add registerBrowserContextTransformer (Christophe Hurpeau)

### v0.12.1

- [`3dcd36d`](https://github.com/alpjs/alp-node/commit/3dcd36df10eaf0b89ae0294eb6b8561b6b7982a2) alp-limosa@2.2.3 (Christophe Hurpeau)

### v0.12.0

change `migrate({ migrationsManager })` to `migrate(migrationsManager)`

- [`b2b277d`](https://github.com/alpjs/alp-node/commit/b2b277dd210293e22516d4d319fe63512bd4cafd) update dependencies, migrate (Christophe Hurpeau)


### v0.11.0

- [`4659b8a`](https://github.com/alpjs/alp-node/commit/4659b8a65b2fa7cd13c0366dc3c85a5e316fe0ab) update dependencies (Christophe Hurpeau)

### v0.10.0

- [`da12962`](https://github.com/alpjs/alp-node/commit/da12962c97b21ab1a4c761d6e5466664b65fef90) upgrade dependencies (Christophe Hurpeau)

### v0.9.0

- [`3535b40`](https://github.com/alpjs/alp-node/commit/3535b4072684845ae4ea08b18bd4498e81854f7f) update dependencies (Christophe Hurpeau)

### v0.8.2

- [`3c78d30`](https://github.com/alpjs/alp-node/commit/3c78d30a40d81e9e9d3354ddeb136821f62586c0) migrate (Christophe Hurpeau)

### v0.8.1

- [`1438745`](https://github.com/alpjs/alp-node/commit/1438745806faf21429a48ee114873149a6e8bb86) alp-language@1.2 (Christophe Hurpeau)

### v0.8.0

- [`2faac54`](https://github.com/alpjs/alp-node/commit/2faac5445af5d8d4f939f1815541db491c539d3b) alp-translate 2.0 (Christophe Hurpeau)

### v0.7.1

- [`90e9088`](https://github.com/alpjs/alp-node/commit/90e90885db70634c32a1080372148f9df3013348) alp-limosa@2.2.2 (Christophe Hurpeau)
