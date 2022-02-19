# HomeMission

<img src="./public/home_mission_grey.png" width = "300">

## [homemission.net](https://homemission.net)

You can join the test home with this [invitation link](https://homemission.net/join?code=ABCDEF) or the invitation code ABCDEF. <!-- TODO -->

## Concept

- Game that enables homes to organize themselves better &rarr; gamification of task assignments makes completion of tasks more enjoyable
- Score for roommates based on finished tasks (Taking out the trash etc.)
- Multiple homes, one user is part of a home and can complete tasks which gives the user points (points vary by task)

## Following Contents <!-- TODO -->

- [Features](#features)
- [Run Application](#run-application)
  - [Production](#production)
  - [Development](#development)
- [Contribute](#contribute)
  - [Folder Structure](#folder-structure)
  - [Data Structure](#data-structure)
  - [Routes](#routes)
  - [Technology](#technology)
  - [Setup Development Environment](#setup-development-environment)
  - [AWS Setup](#aws-setup)
- [Retrospective](#retrospective)

## Features <!-- TODO -->

### General

- Custom logo and favicon
- HTTPS for production
- Light and dark mode
- English and German
- Feedback messages, tooltips and loading indicators

### Welcome Page

- Always redirect to the welcome page if user is not logged in
- Log in / Sign up with Auth0

### Join Page

- Always redirect to the join page if user has no home
- Create a home with a name and default task types in the selected language
- Join a home with an invitation code
- Show dialog if user tries to join with invitation link

### Overview Page

- Large calendar shows tasks for dates
- Create new tasks when clicking onto icon in date cell
  - Date selection (date from date cell is selected by default)
  - Task type selection (new task type is created if none is selected)
  - Delete task types
  - Show points for selected task type / modify points for new task type
  - Option to create a series
- Show task details when clicked on task
  - Complete task
  - Assign / unassign task or completion info
  - Delete one task / all tasks from a series / following

### Statistics Page <!-- TODO -->

- Show weekly / monthly progress of task completion
- Show charts of points

### History Page <!-- TODO -->

- Document every action to prevent abuse

### Navbar

- Only show when user is logged in
- Logo with link to overview page
- Home name with edit
- Roommates with invite button
- Display points (automatically updated)
- Langauge selection
- Color mode switch
- User menu with name, edit name and logout button

### Left Bar

- Links to pages
- Invite button
- Leave home button

### Right Bar

- Open tasks (unassigned or assigned to current user and two weeks in the past / four in the future)
- Complete task (disabled for tasks further in the future than one week)

### Automation

- Automated code formatting, linting and testing enforced by git hooks and continuous integration pipeline
- Automated building of docker images and saving in the registry
- Automated deployment to AWS with continuous deployment pipeline
- Simple production start with docker-compose

## Run Application

To run the application you need to install [Node.js](https://nodejs.org/) and [Docker](https://www.docker.com/).

### Production

Define secrets:

1. Copy [`.env.example`](.env.example) to `/.env.local` and set a `DATABASE_PASSWORD` and `AUTH0_SECRET` and change `AUTH0_BASE_URL` to url in the last step of the two following variants.
2. Copy the `AUTH0_CLIENT_SECRET` from [production Auth0 client](https://manage.auth0.com/dashboard/eu/wg-organisierspiel/applications/tsmSjPG8pw0w7M119EmQShEY2JayHHxS/settings).

Use prebuilt Docker container:

1. Login to GitLab registry: `docker login registry.code.fbi.h-da.de`.
2. Start application: `docker-compose -f docker-compose.prod.yml --env-file=.env.local up -d`.
3. Open in browser: [`http://localhost:5000`](http://localhost:5000).

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
- [`/public/locales/`](public/locales):
  Translation files.
  See [next-i18next](#next-i18next).
- [`/src/`](src)
  - [`components/`](src/components):
    [React Components](https://reactjs.org/docs/components-and-props.html) to be used in Pages.
  - [`entities/`](src/entities):
    Server-Side Data Structure.
    See [TypeGraphQL](#typegraphql) and [TypeORM](#typeorm).
  - [`lib/`](src/lib)
    - [`auth0/`](src/lib/auth0): Check Auth0 authentication with TypeGraphQL.
      See [TypeGraphQL](#typegraphql) and [Auth0](#auth0).
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
  - [`styles/`](src/styles):
      [Theming](https://mui.com/customization/theming/).
      See [MUI](#mui).
- [`/test/`](test):
  See [Jest](#jest).
- [`/.editorconfig`](.editorconfig):
  See [EditorConfig](#editorconfig).
- [`/.eslintrc.json`](.eslintrc.json):
  See [ESLint](#eslint).
- [`/.gitlab-ci.yml`](.gitlab-ci.yml):
  GitLab pipeline with build, test and deploy jobs.
- [`/.graphql-let.yml`](.graphql-let.yml):
  See [graphql-let](#graphql-let).
- [`/.prettierrc`](.prettierrc):
  See [Prettier](#prettier).
- [`/docker-compose.prod.yml`](docker-compose.prod.yml):
  Production Docker-Compose Setup.
- [`/docker-compose.yml`](docker-compose.yml):
  Docker Container for Database.
  See [MySQL](#mysql).
- [`/Dockerfile`](Dockerfile):
  Build production Docker image.
- [`/jest.config.js`](jest.config.js):
  See [Jest](#jest).
- [`/next-i18next.config.js`](next-i18next.config.js):
  See [next-i18next](#next-i18next).
- [`/tsconfig.json`](tsconfig.json):
  See [TypeScript](#typescript).

### Data Structure

The entities are defined in [`/src/entities/`](src/entities). The GraphQL schema is emitted to [`/schema.gql`](schema.gql) and available in the [GraphQL Playground](http://localhost:3000/api/graphql) when in [development mode](#development) together with a documentation. The GraphQL types are the same as the database entities (See [TypeGraphQL](#typegraphql) and [TypeORM](#typeorm)).

<!-- TODO -->

```graphql
# Users are saved in Auth0 and a copy is saved when the user logs in.
# The name can be changed and the picture is updated by Auth0 on every log in.
type User {
  # The id is provided by Auth0.
  id: ID!

  # The name is initially provided by Auth0 and can be updated by the user.
  name: String!

  # The picture is provided by Auth0 and is updated on every log in.
  picture: String!

  # The points of the user are increased on task completion and reset when the home changes.
  points: Float!
}

# Home is the main entity.
# Homes are created by users.
# Users can give their home a name.
# Users can invite others by giving them the code (invitation code) of their home.
# Each home has its own set of tasks, created and maintained by members of the home.
type Home {
  # The id is automatically generated.
  id: ID!

  # The name of the home.
  name: String!

  # The invitation code of the home.
  # Automatically generated string consisting of 6 alphanumeric uppercase characters.
  code: String!

  # The users that are part of the home (roommates).
  users: [User!]!

  # The history entries for the home.
  history: [History!]!

  # The available task types.
  taskTypes: [TaskType!]!

  # Tasks that belong to the home.
  tasks: [Task!]!

  # Task receipts that belong to the home.
  receipts: [TaskReceipt!]!
}

# The activity history of a home.
# Is used to document all events.
type History {
  # The id is automatically generated.
  id: ID!

  # The date when the event was recorded.
  date: String!

  # The type of the event.
  type: HistoryType!

  # The history may contain extra info.
  extraInfo: String

  # The user that triggered the event.
  user: User!

  # The history may contain a reference to a task type.
  taskType: TaskType

  # The history may contain a reference to a task.
  task: Task

  # The history may contain a reference to a task series.
  taskSeries: TaskSeries

  # The history may contain a reference to an affected user.
  affectedUser: User
}

# The event type of a history entry.
enum HistoryType {
  HOME_CREATED
  HOME_RENAMED
  USER_JOIN
  USER_LEAVE
  USER_RENAME
  TASK_TYPE_CREATED
  TASK_TYPE_DELETED
  TASK_TYPE_UPDATED
  TASK_SERIES_CREATED
  TASK_SERIES_DELETED
  TASK_SERIES_SUB_DELETED
  TASK_SERIES_UPDATED
  TASK_CREATED
  TASK_DELETED
  TASK_UPDATED
  TASK_COMPLETED
  TASK_ASSIGNED
  TASK_UNASSIGNED
}

# A template for tasks containing name and points.
type TaskType {
  # The id is automatically generated.
  id: ID!

  # The name of the task type.
  name: String!

  # The amount of points the task is worth.
  points: Float!
}

# A task is an instantiation of a task type at a specific date.
# It can belong to a series an may have an assignee.
# It also has a receipt if the task is completed.
type Task {
  # The id is automatically generated.
  id: ID!

  # The date when the task should be completed.
  date: DateTime!

  # The type of the task.
  type: TaskType!

  # The series that the task belongs to.
  # Null if the task does not belong to a series.
  series: TaskSeries

  # The user that the task is assigned to.
  # Null if no user is assigned.
  assignee: User

  # The receipt of the task.
  # Null if the task has not been completed.
  receipt: TaskReceipt
}

# The javascript `Date` as string. Type represents date and time as the ISO Date string.
scalar DateTime

# A series of tasks.
# Is used to manage multiple tasks belonging to the same series.
type TaskSeries {
  # The id is automatically generated.
  id: ID!
}

# The receipt of a task when the task is completed.
type TaskReceipt {
  # The id is automatically generated.
  id: ID!

  # The date when the task was completed.
  completionDate: DateTime!

  # Copy of the name of the task type to avoid cascading.
  name: String!

  # Copy of the points of the task type to disable cascading.
  points: Float!

  # The user that completed the task.
  completer: User!
}

type UserStatistic implements Statistic {
  # The calculated data points for the user.
  data: [DataPoint!]!

  # The user that the statistic belongs to.
  # Is null for the aggregated statistic of users that left the home.
  user: User
}

# An array of data points that contain the calculated points.
interface Statistic {
  # The calculated data points.
  data: [DataPoint!]!
}

# No database entity.
# The data points contains the points per day and per week for a specific date.
type DataPoint {
  # The date that the points were calculated for.
  date: DateTime!

  # Sum of achieved points at this day.
  pointsDay: Float!

  # Sum of achieved points in the last 7 days.
  pointsWeek: Float!
}

# No database entity.
# A statistic for a specific home.
type HomeStatistic implements Statistic {
  # The calculated data points for the home.
  data: [DataPoint!]!

  # The calculated percentage of completed tasks in the next 7 days.
  weeklyProgress: Float!

  # The calculated percentage of completed tasks in the next 30 days.
  monthlyProgress: Float!
}
```

### Routes

#### Next.js Pages

In Next.js the routes match the paths in the file system. The pages are located in [`/src/pages/`](src/pages) (See [Next.js](#nextjs)).

- [`/`](src/pages/index.tsx): The user will always be redirected to this welcome page if he is not logged in. Links to the Auth0 login page. The `returnTo` query parameter saves the initially requested page to return to after login.
- [`/api/auth/login`](src/pages/api/auth/[...auth0].ts): Redirects to the Auth0 login page.
- [`/api/auth/logout`](src/pages/api/auth/[...auth0].ts): Redirects to Auth0 logout.
- [`/join`](src/pages/join.tsx): The user will always be redirected to the join page if he is logged in but has no home. The `returnTo` query parameter saves the initially requested page to return to after joining a home. If the `code` query parameter is present a dialog will ask the user if he would like to join the home with the invitation code.
- [`/overview`](src/pages/overview.tsx): The main page. The user will be redirected from the welcome page and the logo in the navbar links to this page.
- [`/statistics`](src/pages/statistics.tsx)
- [`/history`](src/pages/history.tsx)
- [404 page](src/pages/404.tsx) is shown for every other route.

The user can navigate between the pages with the left bar.

#### GraphQL Operations

The GraphQL server is available at the route [`/api/graphql`](src/pages/api/graphql.ts) (See [GraphQL](#graphql)). In [development mode](#development), you can use the [GraphQL Playground](http://localhost:3000/api/graphql). The available operations are also documented there.

<!-- TODO -->
```graphql
type Query {
  # Get the authenticated user from the database or null if the user is not authenticated.
  user: User

  # Get the home of the authenticated user from the database or null if the user has no home.
  home: Home

  # Get all task types that belong to the users home.
  taskTypes: [TaskType!]!

  # Get all tasks that belong to the users home.
  tasks: [Task!]!

  # Get open tasks that have not been completed yet and are not assigned to another user.
  # Only load tasks max two weeks in the past and max four weeks in the future.
  openTasks: [Task!]!

  # Get all receipts that are correlated to the users home.
  receipts: [TaskReceipt!]!

  # Generate the statistics for each user of home.
  # Calculate the sum of points achieved per day and week per user for the past two weeks.
  # Include a statistic for users that left the home.
  userStatistics: [UserStatistic!]!

  # Generate the statistics for a home.
  # Calculate the sum of points achieved per day and week in the users home for the past two weeks.
  # Calculate the percentage of completed tasks in the next week and month.
  homeStatistic: HomeStatistic!
}

type Mutation {
  # Rename the authenticated user.
  renameUser(
    # The new name.
    name: String!
  ): User!

  # Create a new home and add the authenticated user to it.
  # Generate default task types in the specified language.
  createHome(
    # The language of the default tasks.
    language: String!

    # The name of the home.
    name: String!
  ): Home!

  # Add the authenticated user to a home that has the requested invitation code.
  joinHome(
    # The invitation code.
    code: String!
  ): Home!

  # Rename the home of the authenticated user.
  renameHome(
    # The new name.
    name: String!
  ): Home!

  # Remove the authenticated user from the home.
  leaveHome: Home

  # Create a new task type.
  createTaskType(
    # The amount of points that associated tasks will be worth.
    points: Float!

    # The name of the new task type.
    name: String!
  ): TaskType!

  # Delete a task type by removing its related home.
  # The task type must belong to the users home.
  deleteTaskType(
    # The id of the task type to delete.
    type: String!
  ): TaskType!

  # Create a new task.
  createTask(
    # The id of the task type.
    type: String!

    # The date when the task should be completed.
    date: Float!
  ): Task!

  # Delete an existing task by removing its related home.
  # The task must belong to the users home.
  deleteTask(
    # The id of the task to delete.
    task: String!
  ): Task!

  # Assign a roommate to a task.
  # The task must belong to the users home.
  assignTask(
    # The id of the new assignee of the task.
    user: String!

    # The id of the task to be assigned.
    task: String!
  ): Task!

  # Remove assignee from task.
  # The task must belong to the users home.
  unassignTask(
    # The id of the task to unassign.
    task: String!
  ): Task!

  # Create a new task series and correlating tasks.
  createTaskSeries(
    # The id of the task type.
    type: String!

    # The number of tasks to create.
    iterations: Float!

    # The interval between tasks measured in weeks.
    interval: Float!

    # The date of the first task of the series.
    start: Float!
  ): TaskType!

  # Delete all tasks correlating to a task series by removing their related home.
  # The series must belong to the users home.
  deleteTaskSeries(
    # The id of the task series to delete.
    series: String!
  ): TaskSeries!

  # Delete tasks correlating to a task series starting from a specified task by removing their related home.
  # The series must belong to the users home.
  deleteTaskSeriesSubsection(
    # The id of the first task to delete.
    start: String!

    # The id of the task series to delete a subsection from.
    series: String!
  ): TaskSeries!

  # Create a new receipt to complete a task.
  # The task must belong to the users home.
  # The task cannot be further in the future than one week.
  # The authenticated user is saved as completer.
  createTaskReceipt(
    # The id of the task to complete.
    task: String!
  ): TaskReceipt!
}
```

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

Write tests and test everything with `npm run test-all`. Or only test specific cases with Jest Runner or `npm run test -- -t "Your test"`.

#### Try Production

If you like you can try how the [app runs in production](#production).

#### Commit

The code is linted on every commit (See [Husky](#husky)).

#### Push

The code is type-checked on every push (See [Husky](#husky)).

For the GitLab pipeline to succeed, make sure to [register](https://docs.gitlab.com/runner/register/#docker) and [start](https://docs.gitlab.com/runner/install/docker.html#option-2-use-docker-volumes-to-start-the-runner-container) your runner:

1. `docker run --rm -it -v gitlab-runner-config:/etc/gitlab-runner gitlab/gitlab-runner:latest register --url https://code.fbi.h-da.de/ --tag-list docker --executor docker --docker-image "docker:20.10.12" --docker-privileged --docker-volumes "/certs/client"`
2. Follow the interactive configuration. The registration token can be found [here](https://code.fbi.h-da.de/isttomare/wg-organisierspiel/-/settings/ci_cd) at 'Runners'.
3. `docker run -d --name gitlab-runner --restart always -v /var/run/docker.sock:/var/run/docker.sock -v gitlab-runner-config:/etc/gitlab-runner gitlab/gitlab-runner:latest`

### AWS Setup

#### EC2 Instance

- t2.micro
- ubuntu-focal-20.04-amd64-server-20211129
- Elastic IP
- Inbound rules:
  - ssh (22) - any ip address
  - http (80) - any ip address
  - https (443) - any ip address
- Applications in Use:
  - [nginx](#nginx-setup)
  - git
  - docker

#### nginx setup

- Port 5000 is mapped to Port 443
- incoming http requests will be redirected to https
- SSL certificate is created via certbot (letsencrypt)

#### Connection via SSH

ssh -i [PEM-Key] ubuntu@[IP-Address]

#### Domain

- [homemission.net](https://homemission.net)
- Address record: Elastic IP

## Retrospective <!-- TODO -->

### Challenges

- Difficulties with TypeORM relation loading
- Apollo Client cache problems
- Automated testing
  - Localization on client side
  - GraphQL and authorization on server side
- h_da GitLab Runners cannot use Docker
- Problems with Next.js compilation

### Outlook

- Achievements
- Possibility to update task types, tasks, task series, receipts
- Layout for small displays
- Translate task types for different users
- Subscribe to calendar events / export events
- Use shared calendar for more events (e.g. vacation)
- Money management
- Grocery list
