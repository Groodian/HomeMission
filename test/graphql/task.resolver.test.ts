import { database, testGraphql } from './testUtils';

describe('Task resolver', () => {
  beforeEach(async () => await database.reset(), 300000); // High timeout for GitLab pipeline

  it('Tasks - returns an empty array when there are no tasks', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'Tasks',
      query: tasksQuery,
      variables: {},
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"tasks":[]}}\n');
  });

  it('Tasks - returns tasks', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(2);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'Tasks',
      query: tasksQuery,
      variables: {},
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"tasks":[{"id":"1","date":"2022-01-02T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":null,"receipt":null,"assignee":null},{"id":"2","date":"2022-01-02T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":null,"receipt":null,"assignee":null}]}}\n'
    );
  });

  it('CreateTask - returns created task', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'CreateTask',
      query: createTaskQuery,
      variables: { date: '2023-01-01', type: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"createTask":{"id":"1","date":"2023-01-01T00:00:00.000Z"}}}\n'
    );
  });

  it('CreateTask - returns error if task type is invalid', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'CreateTask',
      query: createTaskQuery,
      variables: { date: '2023-01-01', type: 'foobar' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"errors":[{"message":"Could not find any entity of type \\"TaskType\\" matching: \\"foobar\\"","locations":[{"line":3,"column":7}],"path":["createTask"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"TaskType\\" matching: \\"foobar\\""}}}],"data":null}\n'
    );
  });

  it('DeleteTask - returns true when task is deleted', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'DeleteTask',
      query: deleteTaskQuery,
      variables: { task: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"deleteTask":true}}\n'
    );
  });

  it('DeleteTask - returns error when task cannot be found', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'DeleteTask',
      query: deleteTaskQuery,
      variables: { task: 'foobar' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"errors":[{"message":"Could not find any entity of type \\"Task\\" matching: \\"foobar\\"","locations":[{"line":3,"column":11}],"path":["deleteTask"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"Task\\" matching: \\"foobar\\""}}}],"data":null}\n'
    );
  });

  // assign self, assign roommate, assign fremde
  it('AssignTask - returns task when user is assigned', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'AssignTask',
      query: assignTaskQuery,
      variables: { user: 'user-1', task: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"assignTask":{"id":"1","date":"2022-01-03T00:00:00.000Z","assignee":{"id":"user-1","name":"name-1","picture":"picture-1"}}}}\n'
    );
  });

  it('AssignTask - returns task when roommate is assigned', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-1', '1');
    await database.addUserToHome('user-2', '1');

    const body = {
      operationName: 'AssignTask',
      query: assignTaskQuery,
      variables: { user: 'user-2', task: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"data":{"assignTask":{"id":"1","date":"2022-01-03T00:00:00.000Z","assignee":{"id":"user-2","name":"name-2","picture":"picture-2"}}}}\n'
    );
  });

  it('AssignTask - returns error when assignee is not part of home', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-1', '1');

    const body = {
      operationName: 'AssignTask',
      query: assignTaskQuery,
      variables: { user: 'user-3', task: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"errors":[{"message":"Failed to execute! Requested roommate does not belong to users home.","locations":[{"line":3,"column":7}],"path":["assignTask"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
    );
  });

  it('AssignTask - returns error when task is not part of users home', async () => {
    await database.insertUsers();
    await database.insertHomes();
    await database.insertTaskTypes(1);
    await database.insertTasks(3);
    await database.addUserToHome('user-2', '1');
    await database.addUserToHome('user-1', '2');

    const body = {
      operationName: 'AssignTask',
      query: assignTaskQuery,
      variables: { user: 'user-2', task: '1' },
    };

    const res = await testGraphql(body, 'user-1');

    expect(res.end).toHaveBeenNthCalledWith(
      1,
      '{"errors":[{"message":"Failed to execute! Task does not belong to users home.","locations":[{"line":3,"column":7}],"path":["assignTask"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
    );
  });

  const tasksQuery = `
    query Tasks {
      tasks {
        id,
        date,
        type {
          id,
          name,
          points,
        },
        series {
          id
        },
        receipt {
          id,
          name,
        },
        assignee {
          id,
          name,
          picture,
        }
      }
    }
  `;

  const createTaskQuery = `
    mutation CreateTask($date: String!, $type: String!) {
      createTask(date: $date, type: $type) {
        id,
        date,
      }
    }
  `;

  const deleteTaskQuery = `
    mutation DeleteTask($task: String!) {
      deleteTask(task: $task)
    }
  `;

  const assignTaskQuery = `
    mutation AssignTask($user: String!, $task: String!) {
      assignTask(user: $user, task: $task) {
        id,
        date,
        assignee {
          id,
          name,
          picture,
        }
      }
    }
  `;
});
