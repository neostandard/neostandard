# Changelog

## [0.13.0](https://github.com/neostandard/neostandard/compare/v0.12.2...v0.13.0) (2026-02-26)


### ⚠ BREAKING CHANGES

* Require Node.js `^20.19.0 || ^22.13.0 || >=24` ([#339](https://github.com/neostandard/neostandard/issues/339))
* eslint-plugin-import-x is no longer included by default. Projects relying on import-x rules will need to manually install and configure eslint-plugin-import-x. See the "Adding back import checking" section in the README for migration instructions. As an alternative, we recommend using TypeScript's compiler (tsc --noEmit) for import validation, which provides more comprehensive checking.
* update dependency globals to v17 ([#335](https://github.com/neostandard/neostandard/issues/335))

### 🌟 Features

* **deps:** update dependency globals to ^17.2.0 ([#347](https://github.com/neostandard/neostandard/issues/347)) ([66d504e](https://github.com/neostandard/neostandard/commit/66d504e42c6ceecf5c36cf679a33d269f255e2e1))
* **deps:** update dependency typescript-eslint to ^8.54.0 ([#348](https://github.com/neostandard/neostandard/issues/348)) ([2cdd443](https://github.com/neostandard/neostandard/commit/2cdd4434bc1c27be08852452dc352b2962c59fc0))
* **deps:** update dependency typescript-eslint to ^8.56.0 ([#357](https://github.com/neostandard/neostandard/issues/357)) ([fe4ba92](https://github.com/neostandard/neostandard/commit/fe4ba92b5b29dcc5b63e885795a279802444e60a))
* remove eslint-plugin-import-x and related dependencies ([#330](https://github.com/neostandard/neostandard/issues/330)) ([248de35](https://github.com/neostandard/neostandard/commit/248de3588817b5dd9334dee43f14312e02679c16))
* Require Node.js `^20.19.0 || ^22.13.0 || >=24` ([#339](https://github.com/neostandard/neostandard/issues/339)) ([ba575f3](https://github.com/neostandard/neostandard/commit/ba575f3963013555506975e2c7e80fd805d72b52))
* update dependency globals to v17 ([#335](https://github.com/neostandard/neostandard/issues/335)) ([a856b81](https://github.com/neostandard/neostandard/commit/a856b811fc6956100e447dfebfecf79564039194))


### 🩹 Fixes

* **deps:** update dependency eslint-plugin-n to ^17.23.2 ([#303](https://github.com/neostandard/neostandard/issues/303)) ([76d50ed](https://github.com/neostandard/neostandard/commit/76d50edcd4e655878922f5633e39dd50f6e004a9))
* **deps:** update dependency find-up to v8 ([#324](https://github.com/neostandard/neostandard/issues/324)) ([d95b6e3](https://github.com/neostandard/neostandard/commit/d95b6e3e0ffe25a6f5c584459204ac5996c6c5ef))
* **deps:** update dependency globals to ^17.3.0 ([#351](https://github.com/neostandard/neostandard/issues/351)) ([94ab3ce](https://github.com/neostandard/neostandard/commit/94ab3ce777aa1fc8972dfd49475045f3b6945dd7))
* **deps:** update dependency peowly to ^1.3.3 ([#356](https://github.com/neostandard/neostandard/issues/356)) ([b873608](https://github.com/neostandard/neostandard/commit/b873608a207e628679ef43e1780b0a1b145b1e49))
* **deps:** update dependency typescript-eslint to ^8.53.1 ([#322](https://github.com/neostandard/neostandard/issues/322)) ([6beb36b](https://github.com/neostandard/neostandard/commit/6beb36bdd1494e078cb31b12070bae7643e106ef))


### 🧹 Chores

* properly apply filter ([#336](https://github.com/neostandard/neostandard/issues/336)) ([bd1ad55](https://github.com/neostandard/neostandard/commit/bd1ad55af7317470b10376526a10117d4f862ec3))

## [0.12.2](https://github.com/neostandard/neostandard/compare/v0.12.1...v0.12.2) (2025-07-04)


### 🩹 Fixes

* **deps:** update dependency eslint-plugin-n to ^17.20.0 ([#238](https://github.com/neostandard/neostandard/issues/238)) ([70fc310](https://github.com/neostandard/neostandard/commit/70fc310a3f70a2745eb13ff6bca014b5a390513c))
* **deps:** update dependency eslint-plugin-react to ^7.37.5 ([#245](https://github.com/neostandard/neostandard/issues/245)) ([dfb5f6c](https://github.com/neostandard/neostandard/commit/dfb5f6ce006bed376abd151373a29a4769a063d0))
* **deps:** update dependency globals to ^15.15.0 ([#244](https://github.com/neostandard/neostandard/issues/244)) ([d4825fa](https://github.com/neostandard/neostandard/commit/d4825fa497b2e062917ef6eea34d0f91dda9aa88))
* **deps:** update dependency typescript-eslint to ^8.35.1 ([#239](https://github.com/neostandard/neostandard/issues/239)) ([da922e8](https://github.com/neostandard/neostandard/commit/da922e81b7ea34bf0560e9747d7972cbce8c01bb))
* **deps:** update eslint-plugin-import etc. ([#290](https://github.com/neostandard/neostandard/issues/290)) ([cd398d4](https://github.com/neostandard/neostandard/commit/cd398d487201d50b90693f6a16d97b7427aaaa52))


### 📚 Documentation

* add examples for all configuration options, CJS note, base example and a better table of content ([#268](https://github.com/neostandard/neostandard/issues/268)) ([3f76650](https://github.com/neostandard/neostandard/commit/3f7665040eed2ef7dbcc9250f857ee072b7685af))

## [0.12.1](https://github.com/neostandard/neostandard/compare/v0.12.0...v0.12.1) (2025-02-05)


### 🩹 Fixes

* include ts config filenames ([#253](https://github.com/neostandard/neostandard/issues/253)) ([f90fd7a](https://github.com/neostandard/neostandard/commit/f90fd7a7b7f8ff99329153a64a0b7d7d0af71767))

## [0.12.0](https://github.com/neostandard/neostandard/compare/v0.11.9...v0.12.0) (2024-12-09)


### ⚠ BREAKING CHANGES

* re-enabled import rules are breaking change

### 🌟 Features

* **deps:** update dependency eslint-plugin-promise to ^7.2.1 ([#223](https://github.com/neostandard/neostandard/issues/223)) ([33184e8](https://github.com/neostandard/neostandard/commit/33184e8ae25bb9c3df06ffb47cd4c30fcb112f59))
* **deps:** update dependency eslint-plugin-react to ^7.37.2 ([#179](https://github.com/neostandard/neostandard/issues/179)) ([11380cb](https://github.com/neostandard/neostandard/commit/11380cb9349fbf8a1e011a6b39dbe41ace9e8028))
* **deps:** update dependency typescript-eslint to ^8.17.0 ([#224](https://github.com/neostandard/neostandard/issues/224)) ([a2d3577](https://github.com/neostandard/neostandard/commit/a2d3577fa19bfda9e0767aeb41e5ecd93068bd2f))
* re-enabled import rules are breaking change ([dcf46c8](https://github.com/neostandard/neostandard/commit/dcf46c83aefa3aa36bac3d63087c4324a29cd639))
* reenabled import checking rules (eslint-plugin-import) ([#197](https://github.com/neostandard/neostandard/issues/197)) ([629e936](https://github.com/neostandard/neostandard/commit/629e936c52965120270e0fd7efe94b5ad66f1018))


### 🩹 Fixes

* **deps:** update dependency globals to ^15.13.0 ([#225](https://github.com/neostandard/neostandard/issues/225)) ([cb93f15](https://github.com/neostandard/neostandard/commit/cb93f15880dc8152d28aeca3c833386f4f559b4c))
* pin `@stylistic/eslint-plugin` to `2.11.0` ([#230](https://github.com/neostandard/neostandard/issues/230)) ([5828bac](https://github.com/neostandard/neostandard/commit/5828bac6392c00422120e0dae65c0bc3a991be07))
* swap to `import-x/` to improve TS resolver ([#231](https://github.com/neostandard/neostandard/issues/231)) ([10bf1ab](https://github.com/neostandard/neostandard/commit/10bf1abd9498b9c6c2dd793c8abe7ced7627a8b0))

## [0.11.9](https://github.com/neostandard/neostandard/compare/v0.11.8...v0.11.9) (2024-11-25)


### 🌟 Features

* **deps:** update dependency @stylistic/eslint-plugin to ^2.11.0 ([#216](https://github.com/neostandard/neostandard/issues/216)) ([50254ae](https://github.com/neostandard/neostandard/commit/50254ae1fbd36b66dae65989f240637f428d5794))
* **deps:** update dependency eslint-plugin-n to ^17.14.0 ([#215](https://github.com/neostandard/neostandard/issues/215)) ([b86e638](https://github.com/neostandard/neostandard/commit/b86e638503c53d01adedfaa7ef188cd2e04bcf80))
* **deps:** update dependency typescript-eslint to ^8.15.0 ([#213](https://github.com/neostandard/neostandard/issues/213)) ([23d362b](https://github.com/neostandard/neostandard/commit/23d362bb6b9b9a621133a27f341ca166b4ab0352))


### 🩹 Fixes

* lazy load jsx options ([#210](https://github.com/neostandard/neostandard/issues/210)) ([9cfe41c](https://github.com/neostandard/neostandard/commit/9cfe41c33eebc74110b3558d867d9798ca7ccb53))

## [0.11.8](https://github.com/neostandard/neostandard/compare/v0.11.7...v0.11.8) (2024-11-12)


### 🌟 Features

* **deps:** update dependency @stylistic/eslint-plugin to ^2.10.1 ([#204](https://github.com/neostandard/neostandard/issues/204)) ([04a4d2a](https://github.com/neostandard/neostandard/commit/04a4d2af5daa2be5063f536ade36a48052a06db6))
* **deps:** update dependency eslint-plugin-n to ^17.13.1 ([#202](https://github.com/neostandard/neostandard/issues/202)) ([503d0cd](https://github.com/neostandard/neostandard/commit/503d0cd008feb259b7913491fe80b3cbade0c5ee))
* **deps:** update dependency typescript-eslint to ^8.13.0 ([#199](https://github.com/neostandard/neostandard/issues/199)) ([c470424](https://github.com/neostandard/neostandard/commit/c470424ade4a115b34d70b007f151895b073f27d))


### 🩹 Fixes

* **deps:** update dependency globals to ^15.12.0 ([#206](https://github.com/neostandard/neostandard/issues/206)) ([1be2d6b](https://github.com/neostandard/neostandard/commit/1be2d6bec69ddc8853a8dda7cae2df7549aa9e83))

## [0.11.7](https://github.com/neostandard/neostandard/compare/v0.11.6...v0.11.7) (2024-10-23)


### 🌟 Features

* **deps:** update dependency @stylistic/eslint-plugin to ^2.9.0 ([#186](https://github.com/neostandard/neostandard/issues/186)) ([a5008be](https://github.com/neostandard/neostandard/commit/a5008be39e885147e1fd4d8c627e04e357550053))
* **deps:** update dependency eslint-plugin-n to ^17.11.1 ([#187](https://github.com/neostandard/neostandard/issues/187)) ([3315b41](https://github.com/neostandard/neostandard/commit/3315b4175e9dbad773aefb508f7fc50fd910e1f5))
* **deps:** update dependency typescript-eslint to ^8.10.0 ([#177](https://github.com/neostandard/neostandard/issues/177)) ([fbf36ef](https://github.com/neostandard/neostandard/commit/fbf36efb43b80167ddb86feb91b541fd8259275d))


### 🩹 Fixes

* **deps:** update dependency globals to ^15.11.0 ([#182](https://github.com/neostandard/neostandard/issues/182)) ([4e25750](https://github.com/neostandard/neostandard/commit/4e25750a00f7c1384b79f3edeea7920ba09fd0e4))

## [0.11.6](https://github.com/neostandard/neostandard/compare/v0.11.5...v0.11.6) (2024-09-24)


### 🌟 Features

* **deps:** update dependency @stylistic/eslint-plugin to ^2.8.0 ([#160](https://github.com/neostandard/neostandard/issues/160)) ([ff8cfd9](https://github.com/neostandard/neostandard/commit/ff8cfd939847ebc67693c89b0694bcd18da0cd8c))
* **deps:** update dependency eslint-plugin-react to ^7.36.1 ([#162](https://github.com/neostandard/neostandard/issues/162)) ([2044fa9](https://github.com/neostandard/neostandard/commit/2044fa90b83efba5910543ea09d9e1e7742257b0))
* **deps:** update dependency typescript-eslint to ^8.6.0 ([#106](https://github.com/neostandard/neostandard/issues/106)) ([565f02a](https://github.com/neostandard/neostandard/commit/565f02a13a00d8438d9e03251d1cac9604d4ddad))


### 🩹 Fixes

* **deps:** update dependency eslint-plugin-n to ^17.10.3 ([#174](https://github.com/neostandard/neostandard/issues/174)) ([4668aab](https://github.com/neostandard/neostandard/commit/4668aab7460b5a36da34a033e8b578b7b0ce82bc))

## [0.11.5](https://github.com/neostandard/neostandard/compare/v0.11.4...v0.11.5) (2024-09-12)


### 🩹 Fixes

* **deps:** types are bundled with ESLint &gt;=9.10 ([#164](https://github.com/neostandard/neostandard/issues/164)) ([13af181](https://github.com/neostandard/neostandard/commit/13af181b683a9138d3a6a0f9c65e2414240a423e))
* **deps:** update dependency @stylistic/eslint-plugin to ^2.6.4 ([#154](https://github.com/neostandard/neostandard/issues/154)) ([40d8445](https://github.com/neostandard/neostandard/commit/40d844514649ae55f1a63fc6582733472a0a69eb))
* ignore jsx-rules in non-jsx files ([#169](https://github.com/neostandard/neostandard/issues/169)) ([c9cef42](https://github.com/neostandard/neostandard/commit/c9cef42cbf0756397640c45b40d3eaa93459e793))


### 🤖 Automation

* **ci:** only run release-please workflow on upstream repo ([#157](https://github.com/neostandard/neostandard/issues/157)) ([08dd476](https://github.com/neostandard/neostandard/commit/08dd476f70a6d45deffed97380a44099186b1c9b))

## [0.11.4](https://github.com/neostandard/neostandard/compare/v0.11.3...v0.11.4) (2024-08-25)


### 🩹 Fixes

* ignore dangle comma in TS enums ([#152](https://github.com/neostandard/neostandard/issues/152)) ([22a99fa](https://github.com/neostandard/neostandard/commit/22a99faac4919677fa3070bdb1194f165a89b33c))


### 📚 Documentation

* add a `Used by` section to the README ([#148](https://github.com/neostandard/neostandard/issues/148)) ([3b17f4f](https://github.com/neostandard/neostandard/commit/3b17f4f187bfc4115a3dc3e9cbcc8e6748ad0a4c))

## [0.11.3](https://github.com/neostandard/neostandard/compare/v0.11.2...v0.11.3) (2024-08-20)


### 🌟 Features

* **deps:** update dependency eslint-plugin-promise to ^7.1.0 ([#135](https://github.com/neostandard/neostandard/issues/135)) ([34074ac](https://github.com/neostandard/neostandard/commit/34074acd84a1ac593d446c7df0863454d279ceb9))
* partly disable `@stylistic/comma-dangle` ([#139](https://github.com/neostandard/neostandard/issues/139)) ([09339ec](https://github.com/neostandard/neostandard/commit/09339ec61529d47f8e9da3f5d993d67ea6cdf679))


### 🩹 Fixes

* **deps:** add `eslint-plugin-react` to eslint deps handling ([#127](https://github.com/neostandard/neostandard/issues/127)) ([3f65825](https://github.com/neostandard/neostandard/commit/3f65825582520709ac2900d17049340b5d9256a2))
* **deps:** update dependency @stylistic/eslint-plugin to ^2.6.2 ([#133](https://github.com/neostandard/neostandard/issues/133)) ([f53dd67](https://github.com/neostandard/neostandard/commit/f53dd67e10bf4b7ccd82628639724ae5fb7ada49))
* **deps:** update dependency @stylistic/eslint-plugin to ^2.6.3 ([#137](https://github.com/neostandard/neostandard/issues/137)) ([afe1387](https://github.com/neostandard/neostandard/commit/afe1387846c973de6ba0e5be60e0286a08133e24))
* **deps:** update dependency eslint-plugin-n to ^17.10.2 ([#134](https://github.com/neostandard/neostandard/issues/134)) ([e23e413](https://github.com/neostandard/neostandard/commit/e23e413cb1e553c8789b8fffc93d43deaf290a40))


### 🧹 Chores

* **cli:** use console log level ([#136](https://github.com/neostandard/neostandard/issues/136)) ([bb370d2](https://github.com/neostandard/neostandard/commit/bb370d2cec486eecd0f6057621b95628507eff5d))

## [0.11.2](https://github.com/neostandard/neostandard/compare/v0.11.1...v0.11.2) (2024-08-01)


### 🌟 Features

* port jsx support from `standard` ([#118](https://github.com/neostandard/neostandard/issues/118)) ([f1c24a2](https://github.com/neostandard/neostandard/commit/f1c24a2c5b80036e8c5506642994b224e62242d1))


### 🩹 Fixes

* **deps:** move all dependencies to `@types/eslint@^9` ([#116](https://github.com/neostandard/neostandard/issues/116)) ([7047941](https://github.com/neostandard/neostandard/commit/70479410ab9b03bb23195fcb7222102ddf9d3368))
* **deps:** update dependencies ([#125](https://github.com/neostandard/neostandard/issues/125)) ([a678003](https://github.com/neostandard/neostandard/commit/a678003cfb85a20db13e4a9b3fceab0fead90d14))
* **deps:** update dependency @stylistic/eslint-plugin to ^2.6.0 ([#123](https://github.com/neostandard/neostandard/issues/123)) ([366bf51](https://github.com/neostandard/neostandard/commit/366bf51b09fce95566f444b28b9d5b983e093473))
* lazy load typescript and style options ([#126](https://github.com/neostandard/neostandard/issues/126)) ([78d9ff8](https://github.com/neostandard/neostandard/commit/78d9ff878c2fc214d6b308b68dec0a015b89155b)), closes [#124](https://github.com/neostandard/neostandard/issues/124)

## [0.11.1](https://github.com/neostandard/neostandard/compare/v0.11.0...v0.11.1) (2024-07-15)


### 🌟 Features

* autodetect ESM at configuration migration ([#98](https://github.com/neostandard/neostandard/issues/98)) ([d51787f](https://github.com/neostandard/neostandard/commit/d51787fa40f9ca3e3d3e833876cd116260af3058))


### 🩹 Fixes

* **deps:** update dependency globals to ^15.7.0 ([#99](https://github.com/neostandard/neostandard/issues/99)) ([a5df311](https://github.com/neostandard/neostandard/commit/a5df311755401744c85f8ca968bb7856bc46b7a3))
* **deps:** update dependency globals to ^15.8.0 ([#104](https://github.com/neostandard/neostandard/issues/104)) ([7b21e44](https://github.com/neostandard/neostandard/commit/7b21e445e4dcde53cab6d32ffd50bedde92a38b0))
* **deps:** update dependency peowly to ^1.3.2 ([#100](https://github.com/neostandard/neostandard/issues/100)) ([aa85713](https://github.com/neostandard/neostandard/commit/aa857131d4ee9198246050b6e719bd691f19ba07))
* **deps:** update dependency typescript-eslint to ^8.0.0-alpha.41 ([#82](https://github.com/neostandard/neostandard/issues/82)) ([b6bac9c](https://github.com/neostandard/neostandard/commit/b6bac9c034b3ba22054f10f9dd3d5c6d2a2f11e1))


### 📚 Documentation

* add mission statement + notes on extending ([#94](https://github.com/neostandard/neostandard/issues/94)) ([7835e15](https://github.com/neostandard/neostandard/commit/7835e1578f847ba3f04557ab17b103be3e7b8537))
* improve list of differences ([#102](https://github.com/neostandard/neostandard/issues/102)) ([ca82086](https://github.com/neostandard/neostandard/commit/ca82086b73de1fd9d1bba6c1c088232db5908635))


### 🧹 Chores

* remove direct dependency on @typescript-eslint/utils ([#93](https://github.com/neostandard/neostandard/issues/93)) ([f224088](https://github.com/neostandard/neostandard/commit/f224088d5c16f094e09e8e3d7f1d93f0f49e3da8))

## [0.11.0](https://github.com/neostandard/neostandard/compare/v0.10.0...v0.11.0) (2024-07-01)


### ⚠ BREAKING CHANGES

* export `typescript-eslint` instead of `@typescript-eslint/eslint-… ([#88](https://github.com/neostandard/neostandard/issues/88))

### 🩹 Fixes

* export `typescript-eslint` instead of `@typescript-eslint/eslint-… ([#88](https://github.com/neostandard/neostandard/issues/88)) ([9502724](https://github.com/neostandard/neostandard/commit/95027247e9975b54f694aae5e16f529eca912219))

## [0.10.0](https://github.com/neostandard/neostandard/compare/v0.9.0...v0.10.0) (2024-07-01)


### ⚠ BREAKING CHANGES

* add eslint-plugin-promise support ([#86](https://github.com/neostandard/neostandard/issues/86))

### 🌟 Features

* add eslint-plugin-promise support ([#86](https://github.com/neostandard/neostandard/issues/86)) ([8f141ae](https://github.com/neostandard/neostandard/commit/8f141ae3d3c968092875f6a4f6bab41ffdbdbceb))
* export plugins for others to use ([26b472b](https://github.com/neostandard/neostandard/commit/26b472b52b32d704f60f12bfb228692f2f74b2f6))

## [0.9.0](https://github.com/neostandard/neostandard/compare/v0.8.0...v0.9.0) (2024-06-27)


### ⚠ BREAKING CHANGES

* reactivate stylistic rules for TypeScript ([#80](https://github.com/neostandard/neostandard/issues/80))

### 🌟 Features

* reactivate stylistic rules for TypeScript ([#80](https://github.com/neostandard/neostandard/issues/80)) ([e2b0daa](https://github.com/neostandard/neostandard/commit/e2b0daabc6e29f82fac957233eac83ecff9326c3))

## [0.8.0](https://github.com/neostandard/neostandard/compare/v0.7.2...v0.8.0) (2024-06-24)


### ⚠ BREAKING CHANGES

* adopt ignore findings from `fastify/fastify` ([#67](https://github.com/neostandard/neostandard/issues/67))

### 🩹 Fixes

* adopt ignore findings from `fastify/fastify` ([#67](https://github.com/neostandard/neostandard/issues/67)) ([7ef49ce](https://github.com/neostandard/neostandard/commit/7ef49ce98b5efc86aa8397d17e7350d5d5daaf43))
* **deps:** update dependency @stylistic/eslint-plugin-js to ^2.2.2 ([#73](https://github.com/neostandard/neostandard/issues/73)) ([6086d51](https://github.com/neostandard/neostandard/commit/6086d512d6dc2bca121c36e91f5c7d27d4cf6c01))
* **deps:** update dependency eslint-plugin-n to ^17.9.0 ([#74](https://github.com/neostandard/neostandard/issues/74)) ([4bc272e](https://github.com/neostandard/neostandard/commit/4bc272eb971dd771aacc0bc01ce5f7a8617b2a50))
* **deps:** update dependency globals to ^15.6.0 ([#75](https://github.com/neostandard/neostandard/issues/75)) ([9ed8b21](https://github.com/neostandard/neostandard/commit/9ed8b21f80ed2e43fd4b7358ff89833fe8ae5509))
* **deps:** update dependency peowly to ^1.3.1 ([#72](https://github.com/neostandard/neostandard/issues/72)) ([d71eb65](https://github.com/neostandard/neostandard/commit/d71eb652a48e1493db77e4cbd87d029e3be36511))
* **deps:** update typescript-eslint monorepo to ^8.0.0-alpha.30 ([#61](https://github.com/neostandard/neostandard/issues/61)) ([8856d07](https://github.com/neostandard/neostandard/commit/8856d074ec1145bc8d19ce65627fe7ee69c3d969))

## [0.7.2](https://github.com/neostandard/neostandard/compare/v0.7.1...v0.7.2) (2024-06-14)


### 🩹 Fixes

* make config names conform to name convention ([#64](https://github.com/neostandard/neostandard/issues/64)) ([2077be0](https://github.com/neostandard/neostandard/commit/2077be04b56d3d8d425b166187e99249469fd5de))

## [0.7.1](https://github.com/neostandard/neostandard/compare/v0.7.0...v0.7.1) (2024-06-11)


### 🩹 Fixes

* **deps:** update dependency eslint-plugin-n to ^17.8.1 ([#58](https://github.com/neostandard/neostandard/issues/58)) ([050d894](https://github.com/neostandard/neostandard/commit/050d894d3f3fc5f62c07723dbce56bf5a781d887))
* **deps:** update dependency globals to ^15.4.0 ([#59](https://github.com/neostandard/neostandard/issues/59)) ([9af005d](https://github.com/neostandard/neostandard/commit/9af005df8e299ecc9274d8dce18156032a2a84e4))
* **deps:** update typescript-eslint monorepo to ^8.0.0-alpha.28 ([#56](https://github.com/neostandard/neostandard/issues/56)) ([ffce1c5](https://github.com/neostandard/neostandard/commit/ffce1c5ff96c8b0784d15ef1852c57361af6a51a))


### 📚 Documentation

* add names to the configs ([9841180](https://github.com/neostandard/neostandard/commit/9841180d0711cb1824f391c3f502436c47166658))
* fix config inspector publish ([9417a88](https://github.com/neostandard/neostandard/commit/9417a886e3b2ca0c224debbe9bface1b1f163941))


### 🧹 Chores

* fix an accidental gitignore ([4651eda](https://github.com/neostandard/neostandard/commit/4651edaea24aa24068c2145c597b8fe39ea66c4b))

## [0.7.0](https://github.com/neostandard/neostandard/compare/v0.6.1...v0.7.0) (2024-06-09)


### ⚠ BREAKING CHANGES

* remove built in ignores + fix ignores for ts ([#40](https://github.com/neostandard/neostandard/issues/40))

### 🩹 Fixes

* remove built in ignores + fix ignores for ts ([#40](https://github.com/neostandard/neostandard/issues/40)) ([86ac8ea](https://github.com/neostandard/neostandard/commit/86ac8ea53263958cdd0744ff7032ce6638e6c7d4))

## [0.6.1](https://github.com/neostandard/neostandard/compare/v0.6.0...v0.6.1) (2024-06-09)


### 🩹 Fixes

* add `--no-default-ignore` to CLI ([6443327](https://github.com/neostandard/neostandard/commit/64433273ce8c292a4337b2c2422f6c1dd078c07b))
* peer errors by removing stylistic-ts ([#36](https://github.com/neostandard/neostandard/issues/36)) ([8805546](https://github.com/neostandard/neostandard/commit/8805546e678035c97906da98544ead37e8dfee57)), closes [#35](https://github.com/neostandard/neostandard/issues/35)


### 📚 Documentation

* add `noDefaultIgnore` to readme ([d63916e](https://github.com/neostandard/neostandard/commit/d63916e695a0600ead47d0dbe008c2b7b3d51cda))


### 🧹 Chores

* validate strict peer dependency installation ([#37](https://github.com/neostandard/neostandard/issues/37)) ([277f17f](https://github.com/neostandard/neostandard/commit/277f17f455efe754b6c2a70930d0e35238495d87))
