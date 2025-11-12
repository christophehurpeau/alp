# Changelog

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.0.2](https://github.com/christophehurpeau/alp/compare/alp-nextjs@6.0.1...alp-nextjs@6.0.2) (2025-11-12)

Note: no notable changes


## [6.0.1](https://github.com/christophehurpeau/alp/compare/alp-nextjs@6.0.0...alp-nextjs@6.0.1) (2025-11-12)

Note: no notable changes


## [6.0.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@5.0.0...alp-nextjs@6.0.0) (2025-10-27)

### ⚠ BREAKING CHANGES

* drop node 20 and build using esbuild

### Features

* drop node 20 and build using esbuild ([812c4c1](https://github.com/christophehurpeau/alp/commit/812c4c1b0ad19984e389af4382a8d1e60643e4f1))

## [5.0.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@4.1.1...alp-nextjs@5.0.0) (2025-08-02)

### ⚠ BREAKING CHANGES

* update dependencies and drop node 20
* update dev dependencies, replace parse-json-object-as-map with native JSON.parse, update koa

### Features

* update babel ([a4bf455](https://github.com/christophehurpeau/alp/commit/a4bf455c715134973c56693b7425aa05de5b10f9))
* update dependencies and drop node 20 ([fc5b322](https://github.com/christophehurpeau/alp/commit/fc5b322e076e9a3c7c4a235d16734b89fd85e211))
* update dev dependencies, replace parse-json-object-as-map with native JSON.parse, update koa ([5ae7723](https://github.com/christophehurpeau/alp/commit/5ae77238cafc573fe72c5eb63b103802b8b2e537))

### Bug Fixes

* **deps:** update dependency next to v14.2.15 [security] ([#597](https://github.com/christophehurpeau/alp/issues/597)) ([d9bb380](https://github.com/christophehurpeau/alp/commit/d9bb380aeb4240f8463c95506af085640a4d2214))
* **deps:** update react monorepo ([#611](https://github.com/christophehurpeau/alp/issues/611)) ([b9ece4d](https://github.com/christophehurpeau/alp/commit/b9ece4dc070bcd49fa6c4a40534162d10087405b))

## [4.1.1](https://github.com/christophehurpeau/alp/compare/alp-nextjs@4.1.0...alp-nextjs@4.1.1) (2024-01-06)

Note: no notable changes




## [4.1.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@4.0.0...alp-nextjs@4.1.0) (2023-12-25)


### Features

* update dependencies ([ddc8f92](https://github.com/christophehurpeau/alp/commit/ddc8f92cccacf6ed2baabf8555f0b37fe281ce9d))




## [4.0.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@3.0.0...alp-nextjs@4.0.0) (2023-07-29)


### ⚠ BREAKING CHANGES

* replace getDocumentInitialProps by createDocumentInitialProps
* drop node 16

### Features

* **alp-nextjs:** add postinstall script to simplify patches ([6ed350f](https://github.com/christophehurpeau/alp/commit/6ed350fb25c894aebdcc60d202894a0a9906b94b))
* **alp-nextjs:** export createNextJsConfig ([093cb23](https://github.com/christophehurpeau/alp/commit/093cb2377b14ac6a168621e045848ec21b1a28de))
* **deps:** update dependency babel-plugin-react-native-web to ^0.19.0 ([#433](https://github.com/christophehurpeau/alp/issues/433)) ([97d22f1](https://github.com/christophehurpeau/alp/commit/97d22f1ef791c1003bf72cb33fa6c7677e4f939e))
* update nextjs ([3053c10](https://github.com/christophehurpeau/alp/commit/3053c1099f90b9474f1c3c333f204cffc7ba3346))
* update react-native and react-native-web ([676e18a](https://github.com/christophehurpeau/alp/commit/676e18aefbe4a9b48debcbfb5327ae7e50d70d6f))
* update simple-oauth2 ([1160431](https://github.com/christophehurpeau/alp/commit/1160431fbdc942b786323e34830d66deb741eb21))


### Code Refactoring

* replace native-base by tamagui ([8b13593](https://github.com/christophehurpeau/alp/commit/8b13593c5b8b2e214648ccaa6c8e3d3d14c4ef27))
* update to node 18 ([26280d6](https://github.com/christophehurpeau/alp/commit/26280d638aba1bd46fa42ad5a571b9626f1fff6d))



## [3.0.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.4.0...alp-nextjs@3.0.0) (2023-03-19)


### ⚠ BREAKING CHANGES

* changed api for alp-node-auth

### Features

* **alp-nextjs:** add babel plugins ([bc9181e](https://github.com/christophehurpeau/alp/commit/bc9181eb5319e0ea825853b34e622b7c3a260fb9))
* auth browser-readable cookie ([7ce6b13](https://github.com/christophehurpeau/alp/commit/7ce6b13752ffd3b6238e6c9fe04fe907e208b7d5))
* update dev dependencies ([9d7e24f](https://github.com/christophehurpeau/alp/commit/9d7e24f8e504d47feae64ca618dc2b3a69babc38))



# [2.4.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.3.0...alp-nextjs@2.4.0) (2023-02-13)


### Features

* add server.js to allow using socket path with nextjs ([c3a69d9](https://github.com/christophehurpeau/alp/commit/c3a69d9a21b20497342e4b4bfec68e0560a7d874))





# [2.3.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.2.0...alp-nextjs@2.3.0) (2023-02-05)


### Features

* **alp-nextjs:** add textDecorationStyle ([ff0fcba](https://github.com/christophehurpeau/alp/commit/ff0fcbacd956ad5c6650a6f010b660bb3e82f094))





# [2.2.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.1.1...alp-nextjs@2.2.0) (2023-01-31)


### Features

* **alp-nextjs:** add react-native-web typings ([33979b3](https://github.com/christophehurpeau/alp/commit/33979b3b70cdd6ee2724781ff107cb1289127766))





## [2.1.1](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.1.0...alp-nextjs@2.1.1) (2023-01-31)

**Note:** Version bump only for package alp-nextjs





# [2.1.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@2.0.0...alp-nextjs@2.1.0) (2023-01-29)


### Features

* update configs ([e9cbde7](https://github.com/christophehurpeau/alp/commit/e9cbde74ddbbb730bc2b65bb6d0b87f2bba8006e))
* update to next 13 ([eb764f4](https://github.com/christophehurpeau/alp/commit/eb764f4266c2ca505e6b9ceefe507054c485a9d5))





# [2.0.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@1.2.1...alp-nextjs@2.0.0) (2022-11-27)


### Features

* drop node 14 ([5d5f90b](https://github.com/christophehurpeau/alp/commit/5d5f90b09d8532278aba75a97f10ea90bbb27919))


### BREAKING CHANGES

* drop node 14





## [1.2.1](https://github.com/christophehurpeau/alp/compare/alp-nextjs@1.2.0...alp-nextjs@1.2.1) (2022-10-29)

**Note:** Version bump only for package alp-nextjs





# [1.2.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@1.1.0...alp-nextjs@1.2.0) (2022-10-19)


### Features

* **alp-nextjs:** export document for native-base and react-native-web ([406edb6](https://github.com/christophehurpeau/alp/commit/406edb6df07d847715407a59fce0e8404c186ca7))





# [1.1.0](https://github.com/christophehurpeau/alp/compare/alp-nextjs@1.0.0...alp-nextjs@1.1.0) (2022-10-16)


### Features

* update to react 18 ([6ac42b8](https://github.com/christophehurpeau/alp/commit/6ac42b84b80bf76853773f3b93819666684327d1))





# 1.0.0 (2022-10-13)

**Note:** Version bump only for package alp-nextjs
