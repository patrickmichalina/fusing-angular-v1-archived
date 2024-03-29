# Fusing Angular

[![CircleCI](https://circleci.com/gh/patrickmichalina/fusing-angular.svg?style=shield)](https://circleci.com/gh/patrickmichalina/fusing-angular)
[![codecov](https://codecov.io/gh/patrickmichalina/fusing-angular/branch/master/graph/badge.svg)](https://codecov.io/gh/patrickmichalina/fusing-angular)
[![dependencies Status](https://david-dm.org/patrickmichalina/fusing-angular/status.svg)](https://david-dm.org/patrickmichalina/fusing-angular)
[![devDependencies Status](https://david-dm.org/patrickmichalina/fusing-angular/dev-status.svg)](https://david-dm.org/patrickmichalina/fusing-angular?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/patrickmichalina/fusing-angular.svg)](https://greenkeeper.io/)
[![Angular Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://angular.io/styleguide)
[![Fusebox-bundler](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg)](https://gitter.im/fusing-angular/Lobby)

The goal of this project is to provide a developer friendly Angular Universal starting point. It differs from the Angular-CLI by focusing soley on Universal applications and uses a faster testing framework and bundler. You can deploy a boilerplate application with a single click via Heroku.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/patrickmichalina/fusing-angular)

# Features

Provides an extremely fast seed project for the development of Angular Universal (isomorphic) projects.

* [Angular](https://github.com/angular/angular/blob/master/CHANGELOG.md) as the application framework
* [FuseBox](http://fuse-box.org) as the TypeScript/JavaScript bundler
* [Jest](https://facebook.github.io/jest) for unit and component testing
* [Nightmare](https://github.com/segmentio/nightmare) for E2E UI testing
* [Sparky](http://fuse-box.org/page/sparky) as the task runner
* [Heroku](https://www.heroku.com) Single Click Deployment
* [SCSS](http://sass-lang.com) support for professional grade CSS management
* [Brotli compression](https://github.com/google/brotli) with [gzip](http://www.gzip.org) fallback
* [CircleCI](https://circleci.com) integration
* [Tree-Shaking](https://fuse-box.org/page/quantum) for production builds
* [Ahead-of-Time](https://angular.io/guide/aot-compiler) (AOT) compilation support
* [angular-tslint-rules](https://github.com/fulls1z3/angular-tslint-rules) as configuration preset for [TSLint](https://github.com/palantir/tslint) and [codelyzer](https://github.com/mgechev/codelyzer).
* [Lazy Loaded](https://angular-2-training-book.rangle.io/handout/modules/lazy-loading-module.html) modules
* Fully typed build tools using [TypeScript](https://www.typescriptlang.org)
* Manage your type definitions using [@types](https://www.npmjs.com/~types)
* Favicon icon generation for multiple devices derived from a single seed image
* Search Engine (SEO) support for Title and Meta tags
* OG (Open Graph) tags for social sharing
* Vendor-agnostic analytics using [angulartics2](https://github.com/angulartics/angulartics2)
* Generic token based Authentication service with [JWT](https://jwt.io) cookie support.
* Analyze bundle sizes by using [source-map-explorer](https://github.com/danvk/source-map-explorer)
* PWA Support via Angular Service Worker

# Heroku Deployment Features

Click button deployment to Heroku gets you setup in just under 5 minutes! It includes the following add-ons which are all free until you need to scale:

* [Auth0](https://elements.heroku.com/addons/auth0) A developer first universal identity management and single sign on platform.
* [Rollbar](https://elements.heroku.com/addons/rollbar) Real-time error monitoring, alerting, and analytics for developers.
* [New Relic APM](https://elements.heroku.com/addons/newrelic) Monitor, troubleshoot, and tune production web applications.
* [Heroku Postgres](https://elements.heroku.com/addons/heroku-postgresql) Reliable and powerful database as a service based on PostgreSQL.
* [SendGrid](https://elements.heroku.com/addons/sendgrid) Email Delivery. Simplified.
* [Algolia Realtime Search](https://elements.heroku.com/addons/algoliasearch) A powerful API delivering relevant results from the first keystroke.

All these services start off free and you can scale them up as your app grows.

# Recipes

Below are some guides to help you bring in common features into your starter.

* [Bootstrap Theme](#) coming soon
* [Material Theme](#) coming soon
* [Bulma Theme](#) coming soon

# Table of Contents

* [Showcase](#showcase)
* [Quick Start](#quick-start)
* [Testing](#testing)
* [Favicons](#favicons)
* [@Types](#types)
* [Environment Variables](#environment-variables)
* [File Structure](#file-structure)
* [Change Log](#change-log)
* [License](#license)

# Showcase

Apps using this starter of set of tools

* [FloSports](https://www.flowrestling.org): an Innovator in Live Digital Sports and Original Content
* [Hip Fit](https://app.hip.fit): Micro-workouts, stretches and physical therapy inspired exercises.
* [Notion Ninja](https://www.notion.ninja): Share and explore startup and business ideas

# Quick Start

**Note that we strongly recommend node >= v9.0.0 and npm >= 5.0.0.**

If you are on a Mac, you can simply run the command `tools/setup/mac.sh`. This will install the dependencies that exist outside of npm

[Configure Auth0](docs/auth0.md)
[Install Postgres](https://www.postgresql.org/download)

To start the seed use:

```bash
$ git clone --depth 1 https://github.com/patrickmichalina/fusing-angular
$ cd fusing-angular

# in a ".env" file for local deveopment
# in environment variables for other environments

# install the project's dependencies
$ npm install

# start the Angular Universal server
$ npm start

# start the server while watching tests and updating app documentation
$ npm run start.deving

# start the Angular Universal server w/ AOT build step
$ npm run start.aot
# can also be called passing the parameter --aot
# npm start --aot

# start the application in Client only mode (not server driven), with HMR enabled
$ npm run start.spa

# start the server in production mode
$ npm run start.prod

# start the server in production mode w/aot enabled (most optimized bundle!)
$ npm run start.prod.aot
```

# Testing

```bash
# single test run
$ npm test

# single test with coverage results
$ npm run test.coverage

# continuous testing
$ npm run test.watch

# e2e testing (primarilly for CI builds)
$ npm run test.e2e.ci

# continuous e2e testing
$ npm run test.e2e.watch
```

# Favicons

```bash
# replace the image at /tools/sources/favicon.png

# generate new images and html
npm run gen.favicon

# commit your changes
```

# @Types

When you include a module that doesn't include typings, you can include external type definitions using the npm @types repo.

i.e, to have youtube api support, run this command in terminal:

```shell
npm i -D @types/youtube @types/gapi @types/gapi.youtube
```

# Environment Variables

```bash
# REQUIRED (assing in your .env file to run locally)
SITE_URL=http://localhost:5000
AUTH0_CALLBACK_URL=http://localhost:5000/callback
AUTH0_CLIENT_ID
AUTH0_CLIENT_SECRET
AUTH0_DOMAIN

# OPTIONAL
GOOGLE_ANALYTICS_TRACKING_ID # if you want to test GA locally, include this
AUTH0_CERT # this is a huge performance gain but not required
ROLLBAR_CLIENT_ACCESS_TOKEN # to track errors from the browser, be sure to grab this from rollbar
SENDGRID_API_KEY # for the SendGrid email service

# for Heroku Builds, to download all depenedencies on Heroku, including devDependencies
# this is required
NPM_CONFIG_PRODUCTION : false
```

## File Structure

We use the component approach in our starter. This is the standard for developing Angular apps and a great way to ensure maintainable code

```
fusing-angular/
 ├──.fusebox/                       * working folder for the js bundler
 ├──.vscode/                        * Visual Studio Code settings
 ├──coverage/                       * stores recent reporting of test coverage
 ├──dist/                           * output files that represent the bundled application and its dependencies
 ├──node_modules/                   * project depdendencies
 |
 ├──src/
 |   ├──client/                     * client Angular code. (most your work will likely be done here)
 |   ├──server/                     * server code
 |   └──testing/                    * testing mocks and helpers to make it easier to get tests up and running
 |
 ├──tools/
 |   ├──config/
 |   |   ├──app.config.ts          * configuration interface for the web applications
 |   |   ├──build.config.ts        * configuration values for the build system
 |   |   ├──build.interfaces.ts    * configuration interfaces for the build system
 |   |   └──build.transformer.ts   * build system config transform helper
 |   |
 |   ├──env/
 |   |   ├──base.ts                * base app configuration
 |   |   ├──dev.ts                 * dev app configuration
 |   |   ├──**.ts                  * arbitrary configuration called via the flag --env-config
 |   |   └──prod.ts                * production app configuration
 |   |
 |   ├──scripts/                   * misc. build helper scripts
 |   ├──sources/                   *
 |   ├──tasks/                     * Sparky tasks
 |   ├──test/                      * testing system related configuration
 |   ├──tslint-rules/              * custom ts-lint rules
 |   └──web/                       * static assets used for common web functions
 |
 ├──.gitignore                     * GIT settings
 ├──.prettierignore                *
 ├──.prettierrc                    *
 ├──app.json                       * Heroku button deployment settings
 ├──circl.yml                      * CirclCI configuration file
 ├──CODE_OF_CONDUCT.md             * standard code of conduct information
 ├──codecov.yml                    * codecov.io configuration file
 ├──CONTRIBUTING.md                * standard contributor information
 ├──fuse.ts                        * FuseBox entry point
 ├──LICENSE                        * software license
 ├──package-lock.json              * what npm uses to manage it's dependencies
 ├──package.json                   * what npm uses to manage it's dependencies
 ├──Procfile                       * Heroku worker settings
 ├──README.md                      * project information
 ├──test-report.xml                * JUNIT test results, not stored in git
 ├──test.api.json                  * Jest test settings for API code
 ├──test.client.json               * Jest test settings for client (angular) code
 ├──tsconfig-aot.json              * typescript config for AOT build using @angular-cli (ngc)
 ├──tsconfig-e2e.json              * typescript config for e2e tests
 └──tsconfig.json                  * typescript config
```

# License

[MIT](https://github.com/patrickmichalina/fusing-angular/blob/master/LICENSE)
