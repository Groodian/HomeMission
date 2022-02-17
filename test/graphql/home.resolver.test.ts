import { database, testGraphql, timeoutLength } from './testUtils';

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
        '{"data":{"createHome":{"name":"my-home","taskTypes":[{"id":"1","name":"Vacuum","points":50},{"id":"2","name":"Clean kitchen","points":60},{"id":"3","name":"Clean bath","points":60},{"id":"4","name":"Do dishes","points":30},{"id":"5","name":"Take out garbage","points":20},{"id":"6","name":"Water plants","points":10}]}}}\n'
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
        '{"data":{"createHome":{"name":"my-home","taskTypes":[{"id":"1","name":"Staubsaugen","points":50},{"id":"2","name":"Küche putzen","points":60},{"id":"3","name":"Bad putzen","points":60},{"id":"4","name":"Geschirr spülen","points":30},{"id":"5","name":"Müll rausbringen","points":20},{"id":"6","name":"Pflanzen gießen","points":10}]}}}\n'
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
