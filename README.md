# HomeMission

<img src="./public/home_mission_grey.png" width = "300">

## Concept

- Game for shared apartments (will be called WGs in the following) to organize themselves a bit better &rarr; gamification of task assignments
- Score for flat mates based on finished tasks (Taking out the trash etc.)
- Multiple WGs, one user is part of one WG and every WG has tasks, which have to be resolved, and this tasks will give points (they will vary)

## Run Application

To run the application you need to install [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/).

### Production

Define secrets:

1. Copy [`.env.example`](.env.example) to `/.env.local` and set a `DATABASE_PASSWORD` and `AUTH0_SECRET`.
2. Copy the `AUTH0_CLIENT_SECRET` from [production Auth0 client](https://manage.auth0.com/dashboard/eu/wg-organisierspiel/applications/tsmSjPG8pw0w7M119EmQShEY2JayHHxS/settings).

Use prebuilt Docker container:

1. Login to GitLab registry: `docker login registry.code.fbi.h-da.de`.
2. Start application: `docker-compose -f docker-compose.prod.yml --env-file=.env.local up -d`.
3. Open in browser: [`http://localhost`](http://localhost).

Or build locally:

1. Install dependencies: `npm ci --ignore-scripts`.
2. Build application: `npm run build`.
3. Start database: `docker-compose --env-file=.env.local up -d`.
4. Start application: `npm start`.
5. Open in browser: [`http://localhost`](http://localhost).

### Development

1. Copy the `AUTH0_CLIENT_SECRET` from [development Auth0 client](https://manage.auth0.com/dashboard/eu/wg-organisierspiel/applications/tsmSjPG8pw0w7M119EmQShEY2JayHHxS/settings) into `/.env.local`.
2. Install dependencies: `npm i`.
3. Start database: `docker-compose up -d`.
4. Start application: `npm run dev`.
5. Open in browser: [`http://localhost:3000`](http://localhost:3000).

## Contribute

The following will describe the structure of [folders](#folder-structure), [routes](#routes) and [data](#data-structure), what [technology](#technology) is used and how to [set up the development environment](#setup-development-environment).

### Folder Structure

Next.js specific folders are omitted. See [Next.js](#nextjs)

- [`/.husky/`](.husky):
  Commit Hooks.
  See [husky](#husky).
- [`/cypress/`](cypress):
  End to End Testing.
  See [Cypress](#cypress).
- [`/src/`](src)
  - [`components/`](src/components):
    [React Components](https://reactjs.org/docs/components-and-props.html) to be used in Pages.
  - [`entities/`](src/entities):
    Server Data Structure.
    See [TypeGraphQL](#typegraphql) and [TypeORM](#typeorm).
  - [`lib/`](src/lib)
    - [`graphql/`](src/lib/graphql):
      See [GraphQL](#graphql).
      - [`operations/`](src/lib/graphql/operations):
        Client-Side [GraphQL Operations](https://graphql.org/learn/queries/).
        See [graphql-let](#graphql-let).
      - [`resolvers/`](src/lib/graphql/resolvers):
        Server-Side [TypeGraphQL Resolvers](https://typegraphql.com/docs/resolvers.html).
        See [TypeGraphQL](#typegraphql).
      - [`apollo-client.ts`](src/lib/graphql/apollo-client.ts):
        See [Apollo Client](#apollo-client).
      - [`apollo-server.ts`](src/lib/graphql/apollo-server.ts):
        See [Apollo Server](#apollo-server).
      - [`schema.ts`](src/lib/graphql/schema.ts):
        Generate and emit GraphQL Schema.
        See [TypeGraphQL](#typegraphql).
    - [`mui/`](src/lib/mui):
      See [MUI](#mui).
      - [`emotion.ts`](src/lib/mui/emotion.ts):
        Emotion Utils.
        See [Emotion](#emotion).
    - [`typeorm/`](src/lib/typeorm):
      See [TypeORM](#typeorm).
      - [`connection.ts`](src/lib/typeorm/connection.ts):
        Database Connection and Config.
    - [`auth0-auth-checker.ts`](src/lib/auth0-auth-checker.ts): Check Auth0 authentication with TypeGraphQL.
      See [TypeGraphQL](#typegraphql) and [Auth0](#auth0).
  - [`styles/`](src/styles):
    - [`theme.ts`](src/styles/theme.ts):
      [Theming](https://mui.com/customization/theming/)
      See [MUI](#mui).
- [`/test/`](test):
  See [Jest](#jest).
- [`/.editorconfig`](.editorconfig):
  See [EditorConfig](#editorconfig).
- [`/.eslintrc.json`](.eslintrc.json):
  See [ESLint](#eslint).
- [`/.graphql-let.yml`](.graphql-let.yml):
  See [graphql-let](#graphql-let).
- [`/.prettierrc`](.prettierrc):
  See [Prettier](#prettier).
- [`/cypress.json`](cypress.json):
  See [Cypress](#cypress).
- [`/docker-compose.prod.yml`](docker-compose.prod.yml):
  Production Docker-Compose Setup.
- [`/docker-compose.yml`](docker-compose.yml):
  Docker Container for Database.
  See [MySQL](#mysql).
- [`/jest.config.js`](jest.config.js):
  See [Jest](#jest).
- [`/next-i18next.config.js`](next-i18next.config.js):
  See [next-i18next](#next-i18next).
- [`/push-docker-image.sh`](push-docker-image.sh):
  Build and push a docker image to the GitLab registry.
- [`/tsconfig.json`](tsconfig.json):
  See [TypeScript](#typescript).

### Routes

In Next.js the routes match the paths in the file system. The pages are located in [`/src/pages/`](src/pages) (See [Next.js](#nextjs)).

The GraphQL server is available at the route [`/api/graphql`](src/pages/api/graphql.ts) (See [GraphQL](#graphql)). In [development mode](#development), you can use the [GraphQL Playground](http://localhost:3000/api/graphql). The available operations are also documented there.

### Data Structure

The entities are defined in [`/src/entities/`](src/entities). The GraphQL schema is emitted to [`/schema.gql`](schema.gql) and available in the [GraphQL Playground](http://localhost:3000/api/graphql) when in [development mode](#development).

### Technology

#### [Next.js](https://nextjs.org/)

The framework used for this application. Includes client and server.

#### [husky](https://github.com/typicode/husky)

Commit hooks for static code analyzing with the following tools:

##### [TypeScript](https://www.typescriptlang.org/)

Typechecking.

##### [ESLint](https://eslint.org/)

Linting. Also checks formatting with:

###### [Prettier](https://prettier.io/)

Formatting. Also reads configuration from:

###### [EditorConfig](https://editorconfig.org/)

Defines coding styles.

#### [Jest](https://jestjs.io/)

Testing framework using:

##### [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

#### [Cypress](https://www.cypress.io/)

End to End testing framework.

#### [MUI](https://mui.com/)

React UI library. Including the default style engine:

##### [Emotion](https://emotion.sh/)

#### [next-i18next](https://github.com/isaachinman/next-i18next#readme)

Internationalization. Using:

##### [react-i18next](https://react.i18next.com/)

Using:

###### [i18next](https://www.i18next.com/)

#### [Auth0](https://auth0.com/)

Authentication provider. Using:

##### [@auth0/nextjs-auth0](https://github.com/auth0/nextjs-auth0#readme)

#### [GraphQL](https://graphql.org/)

Query language used for communication between client and server.

##### [Apollo Client](https://www.apollographql.com/docs/react/)

Generating code with:

##### [graphql-let](https://github.com/piglovesyou/graphql-let#readme)

Using:

###### [GraphQL Code Generator](https://graphql-code-generator.com/)

With:

###### [TypeScript React Apollo](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo)

##### [Apollo Server](https://www.apollographql.com/docs/apollo-server/)

Using:

###### [TypeGraphQL](https://typegraphql.com/)

Defines and builds GraphQL schema. Validates inputs using:

###### [class-validator](https://github.com/typestack/class-validator#readme)

#### [TypeORM](https://typeorm.io/)

Interacting with database. Using:

##### [Node MySQL 2](https://github.com/sidorares/node-mysql2#readme)

Library for interacting with MySQL database.

##### [MySQL Database in Docker](https://hub.docker.com/_/mysql/)

### Setup Development Environment

#### Clone Repository

`git clone https://code.fbi.h-da.de/isttomare/wg-organisierspiel.git`

#### Setup Project

`npm install`

When you install the dependencies, the following npm scripts are executed:

1. `npm run prepare`:
   Automatically runs after installation.
   1. `husky install`:
      Initializes Husky (See [Husky](#husky)) .
   2. `npm run codegen`: Generates code (See [GraphQL](#graphql)).
      1. `npm run emit-schema`: Writes the GraphQL schema to [`/schema.gql`](schema.gql) (See [TypeGraphQL](#typegraphql)).
      2. `graphql-let`: Generates React Apollo components from schema and [operations](src/lib/graphql/operations) (See [graphql-let](#graphql-let)).

#### Install plugins

For better coding experience, make sure that the development tools are included in your IDE. The following lists plugins that should be used with [Visual Studio Code](https://code.visualstudio.com/).

Plugins for this project:

- [EditorConfig](https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig) (See [EditorConfig](#editorconfig))
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (See [Prettier](#prettier))
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) (See [ESLint](#eslint))
- [Jest Runner](https://marketplace.visualstudio.com/items?itemName=firsttris.vscode-jest-runner) (See [Jest](#jest))
- [GraphQL](https://marketplace.visualstudio.com/items?itemName=GraphQL.vscode-graphql) (See [GraphQL](#graphql))
- [Docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker) (See [MySQL Database in Docker](#mysql-database-in-docker))

Recommended general plugins:

- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [Git Graph](https://marketplace.visualstudio.com/items?itemName=mhutchie.git-graph)
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- [Markdown](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
- [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)

Other general plugins:

- [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)
- [npm Dependency Links](https://marketplace.visualstudio.com/items?itemName=herrmannplatz.npm-dependency-links)
- [Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- [SVG](https://marketplace.visualstudio.com/items?itemName=jock.svg)
- [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

#### Develop

See [how to run the app in development mode](#development).

#### Format

After you have written your code, format it with `npm run format`. You can also use Prettier in your IDE to format the code.

#### Test

First, make sure to start the database: `docker-compose up -d`.

Write tests and test everything with `npm run test-all`. Or only test specific cases with `npm run cypress` and Jest Runner.

#### Try Production

If you like you can try how the [app runs in production](#production).

#### Commit

The code is linted on every commit (See [Husky](#husky)).

#### Push

The code is type-checked on every push (See [Husky](#husky)).

#### Push Docker Image

You can build and push the docker image to the GitLab registry with the commands from `/push-docker-image.sh`.
