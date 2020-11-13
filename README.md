<!--
*** I'm using markdown "reference style" links for readability.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- ! highlight and 'ctrl+shift+L' to replace all ! -->
GIT-USERNAME-HERE
REPO-NAME-HERE
APP-NAME-HERE
PUT-TECH-STACK-HERE
API-DEPLOY-URL-HERE
<!-- ! highlight and 'ctrl+shift+L' to replace all ! -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE">
    <img src="images/LOGO-PATH-HERE" alt="Logo" width="100" height="100">
  </a>

  <h3 align="center">APP-NAME-HERE - Server</h3>

  <p align="center">
    PUT-TECH-STACK-HERE
    <br />
    <a href="https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/issues">Report Bug</a>
    ·
    <a href="https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/issues">Request Feature?</a>
  </p>
</p>

---

<h1 align="center">APP-NAME-HERE</h1>

> ---
>
> _This will be a comprehensive README for the sake of both prospective employers and fellow cohort peers, and whomever else would be interested in some of the techniques I've learned creating my frist Fullstack application. As a bonus, this README has some interesting implementations, though I won't address them here._
>
> _If you'd like to test the server via Postman, visit the client app..._
>
> <div><a href="https://API-DEPLOY-URL-HERE">here</a></div>
>
> _...register a user, grab your Bearer Token in dev tools, and use this endpoint: https://glacial-basin-85263.herokuapp.com/setapp/v1_
>
> ---

---

###### This README will systematically go over the entire app from the top level to the bottom layer, so I'll provide links to various sections for convenience.

# TODO - ADD DIRECTORY LINKS!

---

<!-- ? For Typescript only!
# Typescript:

## tsconfig.json:

Not much to it here - I opted for '`strict`' mode and '`ESNext`', though I need to compile to '`CommonJS`' since the tests are still in JS.

I wanted to utilize path aliases, but realized that when compiled the imports aren't updating, so for now I opted for avoiding referencing the `src/` folder in any local imports.

## jsonwebtoken.d.js:

I needed to re-declare the module here for this specific bit of code (line 187):

```js
type VerifiedObject = { sub: string };

export function verify(
  token: string,
  secretOrPublicKey: Secret,
  options?: VerifyOptions
): VerifiedObject;
```

Initially, the verify function had this type of return: `verify(): object | string` ...this didn't play nice when I needed the 'sub' key from it's return value:

```js
/* auth.js (line 66) */
const user = await CRUDService.getByName(req.app.get('db'), payload.sub);
```

Besides that, the module remains unchanged...

## express.d.js:

As a whole, I prefer writing namespaces for typing, and it so happens this is the preferred method (according to the docs, anyways) to customize the Express Request/Response interfaces.

I'd generally have a 'Types' namespace/file for app-specific types, but because all my custom types are only loaded into the Express namespace, I left them all under the same file.

The difference between the simlar naming conventions would be the something like `type NewUser` is applied to objects created from the `req.body`, while `type User` is created by pulling data from the database.

> _The `id` looks odd because it's only ever used in testing_

The only notable exception to the above ruls would be the custom Error type:

```js
type ErrorName = 'ValidationError' | 'UniqueViolationError';

type ExtError = {
  name: ErrorName;
  status: number;
  message: string;
  stack: string;
  errors: string;
};
```

...needed for my custom error handler:

```js
/* error-handlers.js */
const errorTypes = {
  ValidationError: 422,
  UniqueViolationError: 409
};

const errorMessages = {
  ValidationError: 'Invalid request',
  UniqueViolationError: 'Already exists.'
};
...
const errorHandler: ErrorRequestHandler = (error: Express.ExtError, _req, res, _next) =>
```

--- -->

# db:

## migrations, seeds

Nothing much to say here, simple SQL code to seed the database

---

# src:

### server.js:

Bog-standard setup using Knex

### config.js:

I use this to configure all environment variables and export them from a single source. You can then access these via destructured imports:

```js
const { NODE_ENV } = require('./config');
```

### app.js:

Most of the setupp here is standard, with some particular use of conditionals and environment variables to configure middleware options. Note the absence of importing `express`, I'll get to that a little later...

### Barrels...

You may have already noticed that there are actually many **[ index.js ]** files peppered throughout the app. These are known as "barrel" exports, and have a few advantages when dealing with a complex file-directory. The index file in the [ routes ] folder has a short explanation, but I'll also put it here:

```js
/*
|--------------------------------------------------------------------------
| BARREL EXPORT FILE
|--------------------------------------------------------------------------
| How-To barrel-export components:
| const thingsRouter = require('./things/thingsRouter')
|
| module.exports = {
|   thingsRouter
| }
|
| Why? Readability:
| const { thingsRouter, stuffRouter, userRouter } = require('./routes')
*/
const usersRouter = require('./users.router');

module.exports = {
  usersRouter
};
```

You can see this in action in **[ app.js ]**:

# TODO!!!
<!-- ```js
const {
  usersRouter,
  songsRouter,
  songsSetsRouter,
  setsRouter,
  gigsRouter
} = require('./routes');
``` -->

> _Note that the import doesn't point to the index file. Node perceives **[ index.js ]** files as points of entry and the default file to grab exports from, essentially making it an implicit file in import statements_

---

## constants:

Not strictly necessary, but this can help prevent typos, along with making changes to the database less tedious to update throughout the app.

---

## libs:

A simple Winston logger, though bacause Heroku doesn't support writing logs in this way, the transports aren't created during production.

---

## middlewares:

#### express-methods.js:

Though it may be inconsequential for a server of this scale, it should be known that every time you import a package from `node_modules` there's a memory cost at runtime, made worse by doing a destructured import. Express is costly to import (~750K unzipped), so I came up with this method here, resulting in importing Express only once in my entire server.

I can create both the `app` and `jsonBodyParser` (which is just middleware), and extract the `Router()` method itself (to be used as a sort of local "helper" function). Beacuase these are now local dependencies, I can import these wherever I want without an impact on runtime performance.

#### body-validators.js:

These are used to extract and validate request body values on a per-route basis, serialize any user-inputs, then creates a completed object passing it on to the next middleware. There are a few helper-functions at the top to DRY up the code a bit.

#### auth.js, error-handlers.js:

There's nothing too special here, just basic Token authentication, password encryption, and error handling/formatting.

---

## routes:

<div align="center">
  <h5>A brief overview of the database:</h5>
  <img src="images/psql_erm.png" alt="erm" width="500">
</div>

> _This isn't 100% representative of the current database implementation, but from a relationship view this is how the Server operates. Currently, the following tables are implemented: users, songs, sets, songs_sets_

---

## services:

---

## <!-- CONTACT -->

## Contact

#### Github - [musicMan1337][github]

#### LinkedIn - [Derek-8Bit-Nellis][linkedin]

#### Facebook - [Derek Nellis][facebook]

#### Instagram - [@derek.8bit.nellis][instagram]

<!-- MARKDOWN LINKS & IMAGES -->

<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[contributors-shield]: https://img.shields.io/github/contributors/GIT-USERNAME-HERE/REPO-NAME-HERE.svg?style=flat-square
[contributors-url]: https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/GIT-USERNAME-HERE/REPO-NAME-HERE.svg?style=flat-square
[forks-url]: https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/network/members
[stars-shield]: https://img.shields.io/github/stars/GIT-USERNAME-HERE/REPO-NAME-HERE.svg?style=flat-square
[stars-url]: https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/stargazers
[issues-shield]: https://img.shields.io/github/issues/GIT-USERNAME-HERE/REPO-NAME-HERE.svg?style=flat-square
[issues-url]: https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/issues
[license-shield]: https://img.shields.io/github/license/GIT-USERNAME-HERE/REPO-NAME-HERE.svg?style=flat-square
[license-url]: https://github.com/GIT-USERNAME-HERE/REPO-NAME-HERE/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: www.linkedin.com/in/derek-8bit-nellis
[product-screenshot]: images/p10k.png

<!-- project links -->

<!-- links to social media accounts -->

[twitter]: http://www.twitter.com/userName
[facebook]: http://www.facebook.com/derek.nellis.9
[googleplus]: https://plus.google.com/+userName
[tumblr]: http://userName.tumblr.com
[dribble]: http://dribbble.com/userName
[linkedin]: https://www.linkedin.com/in/derek-8bit-nellis/
[github]: http://www.github.com/musicMan1337
[instagram]: https://www.instagram.com/derek.8bit.nellis/?hl=en
