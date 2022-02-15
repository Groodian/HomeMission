import { TFunction } from 'next-i18next';
import { database, testGraphql, timeoutLength } from './testUtils';

// Mock localization
jest.mock('next-i18next', () => ({
  i18n: {
    getFixedT(
      lng: string | readonly string[],
      ns?: string | readonly string[] | undefined,
      keyPrefix?: string | undefined
    ) {
      const t: TFunction = (key, options) =>
        `key: ${key}, options: ${options}, lng: ${lng}, ns: ${ns}, keyPrefix: ${keyPrefix}`;
      return t;
    },
  },
}));

describe('Home resolver with', () => {
  beforeEach(database.reset, timeoutLength); // High timeoutLength for GitLab pipeline
  afterAll(database.shutdown);

  it(
    'Home query returns null when user has no home',
    async () => {
      await database.insertUsers();

      const body = {
        operationName: 'Home',
        query: homeQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"home":null}}\n');
    },
    timeoutLength
  );

  it(
    'Home query returns the users home',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'Home',
        query: homeQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"home":{"id":"1","name":"name-1","code":"code-1"}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateHome mutation returns the home that user creates and default tasks EN',
    async () => {
      await database.insertUsers();

      const body = {
        operationName: 'CreateHome',
        query: createHomeQuery,
        variables: { name: 'my-home', language: 'en' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"createHome":{"name":"my-home","taskTypes":[{"id":"1","name":"key: vacuum, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"2","name":"key: clean-kitchen, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"3","name":"key: clean-bath, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"4","name":"key: wash-windows, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"5","name":"key: wash-dishes, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":30},{"id":"6","name":"key: take-out-garbage, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":20},{"id":"7","name":"key: water-plants, options: undefined, lng: en, ns: server_default-tasks, keyPrefix: undefined","points":10}]}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateHome mutation returns the home that user creates and default tasks DE',
    async () => {
      await database.insertUsers();

      const body = {
        operationName: 'CreateHome',
        query: createHomeQuery,
        variables: { name: 'my-home', language: 'de' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"createHome":{"name":"my-home","taskTypes":[{"id":"1","name":"key: vacuum, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"2","name":"key: clean-kitchen, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"3","name":"key: clean-bath, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"4","name":"key: wash-windows, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":50},{"id":"5","name":"key: wash-dishes, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":30},{"id":"6","name":"key: take-out-garbage, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":20},{"id":"7","name":"key: water-plants, options: undefined, lng: de, ns: server_default-tasks, keyPrefix: undefined","points":10}]}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'JoinHome mutation returns the home that user joins',
    async () => {
      await database.insertUsers();
      await database.insertHomes();

      const body = {
        operationName: 'JoinHome',
        query: joinHomeQuery,
        variables: { code: 'code-1' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"joinHome":{"id":"1","name":"name-1","code":"code-1"}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'JoinHome mutation returns error when user uses invalid code',
    async () => {
      await database.insertUsers();
      await database.insertHomes();

      const body = {
        operationName: 'JoinHome',
        query: joinHomeQuery,
        variables: { code: 'foobar' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to add user to home. Check that the code is valid!","locations":[{"line":3,"column":7}],"path":["joinHome"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'RenameHome mutation returns the new name',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'RenameHome',
        query: renameHomeQuery,
        variables: { name: 'new-name' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"renameHome":{"id":"1","name":"new-name","code":"code-1"}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'LeaveHome mutation returns null',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'LeaveHome',
        query: leaveHomeQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"leaveHome":null}}\n'
      );
    },
    timeoutLength
  );

  const homeQuery = `
    query Home {
      home {
        id
        name
        code
      }
    }
  `;

  const createHomeQuery = `
    mutation CreateHome($name: String!, $language: String!) {
      createHome(name: $name, language: $language) {
        name
        taskTypes {
          id
          name
          points
        }
      }
    }
  `;

  const joinHomeQuery = `
    mutation JoinHome($code: String!) {
      joinHome(code: $code) {
        id
        name
        code
      }
    }
  `;

  const renameHomeQuery = `
    mutation RenameHome($name: String!) {
      renameHome(name: $name) {
        id
        name
        code
      }
    }
  `;

  const leaveHomeQuery = `
    mutation LeaveHome {
      leaveHome {
        id
        name
        code
      }
    }
  `;
});
