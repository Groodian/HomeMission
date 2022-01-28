import { database, testGraphql } from './testUtils';

describe('User resolver', () => {
  beforeEach(async () => await database.reset(), 300000); // High timeout for GitLab pipeline

  it('returns the authenticated user', async () => {
    await database.insertUsers();

    const body = {
      operationName: 'User',
      query: `
        query User {
          user {
            id
            name
            picture
            points
          }
        }
      `,
      variables: {},
    };

    const res = await testGraphql(body, 'user-2');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"user":{"id":"user-2","name":"name-2","picture":"picture-2","points":0}}}\n'
    );
  });

  it('returns null for an unauthenticated user', async () => {
    const body = {
      operationName: 'User',
      query: `
        query User {
          user {
            id
            name
            picture
            points
          }
        }
      `,
      variables: {},
    };

    const res = await testGraphql(body);

    expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"user":null}}\n');
  });
});
