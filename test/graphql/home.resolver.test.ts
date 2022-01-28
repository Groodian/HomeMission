import { database, testGraphql } from './testUtils';

describe('Home resolver with', () => {
  beforeEach(async () => await database.reset(), 300000); // High timeout for GitLab pipeline

  it('Home query returns null when user has no home', async () => {
    await database.insertUsers();

    const body = {
      operationName: 'Home',
      query: homeQuery,
      variables: {},
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"home":null}}\n');
  });

  it('Home query returns the users home', async () => {
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
  });

  it('JoinHome mutation returns the home that user joins', async () => {
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
      '{"data":{"joinHomeByCode":{"id":"1","name":"name-1","code":"code-1"}}}\n'
    );
  });

  it('JoinHome mutation returns error when user uses invalid code', async () => {
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
      '{"errors":[{"message":"Failed to add user to home. Check that the code is valid!","locations":[{"line":3,"column":7}],"path":["joinHomeByCode"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
    );
  });

  const homeQuery = `
    query Home {
      home {
        id
        name
        code
      }
    }
  `;

  const joinHomeQuery = `
    mutation JoinHome($code: String!) {
      joinHomeByCode(code: $code) {
        id
        name
        code
      }
    }
  `;
});
