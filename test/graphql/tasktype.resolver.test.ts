import { database, testGraphql } from './testUtils';

describe('Task type resolver with', () => {
  beforeEach(async () => await database.reset(), 300000); // High timeout for GitLab pipeline
  afterAll(async () => await database.shutdown());

  it('TaskTypes query returns an empty array when there are no task types', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'TaskTypes',
      query: taskTypesQuery,
      variables: {},
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"taskTypes":[]}}\n');
  });

  it('TaskTypes query returns task types', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'TaskTypes',
      query: taskTypesQuery,
      variables: {},
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"taskTypes":[{"id":"1","name":"name-1","points":1},{"id":"2","name":"name-2","points":2},{"id":"3","name":"name-3","points":3}]}}\n'
    );
  });

  it('CreateTaskType mutation returns created task type', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'CreateTaskType',
      query: createTaskTypeQuery,
      variables: { name: 'type', points: 10 },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"createTaskType":{"id":"1","name":"type","points":10}}}\n'
    );
  });

  it('RemoveTaskType mutation returns task type when it is removed from home', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'RemoveTaskType',
      query: removeTaskTypeQuery,
      variables: { type: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"removeTaskType":{"id":"1","name":"name-1","points":1}}}\n'
    );
  });

  it('RemoveTaskType mutation returns error when task type cannot be found', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'RemoveTaskType',
      query: removeTaskTypeQuery,
      variables: { type: 'foobar' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"errors":[{"message":"Could not find any entity of type \\"TaskType\\" matching: \\"foobar\\"","locations":[{"line":3,"column":7}],"path":["removeTaskType"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"TaskType\\" matching: \\"foobar\\""}}}],"data":null}\n'
    );
  });

  const taskTypesQuery = `
    query TaskTypes {
      taskTypes {
        id,
        name,
        points,
      }
    }
  `;

  const createTaskTypeQuery = `
    mutation CreateTaskType($name: String!, $points: Float!) {
      createTaskType(name: $name, points: $points) {
        id,
        name,
        points,
      }
    }
  `;

  const removeTaskTypeQuery = `
    mutation RemoveTaskType($type: String!) {
      removeTaskType(type: $type) {
        id,
        name,
        points,
      }
    }
  `;
});
