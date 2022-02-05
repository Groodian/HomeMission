import { database, testGraphql, timeoutLength } from './testUtils';

describe('Task resolver with', () => {
  beforeEach(database.reset, timeoutLength); // High timeoutLength for GitLab pipeline
  afterAll(database.shutdown);

  it(
    'Tasks query returns an empty array when there are no tasks',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'Tasks query returns tasks',
    async () => {
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
        '{"data":{"tasks":[{"id":"1","date":"2022-01-02T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":null,"receipt":null,"assignee":null},{"id":"2","date":"2022-01-03T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":null,"receipt":null,"assignee":null}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'OpenTasks query returns only tasks that have a relevant date and are part of users home',
    async () => {
      const today = new Date();
      const oldDate = new Date(today.getTime() - 28 * 24 * 60 * 60 * 1000); // 28 days ago
      const futureDate = new Date(today.getTime() + 64 * 24 * 60 * 60 * 1000); // 64 days in the future

      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1); // task type in users home
      await database.insertTaskTypes(1, '2'); // task type in foreign home
      await database.insertTasks(2, '1', oldDate); // uninteresting tasks in users (invalid because old)
      await database.insertTasks(2, '1', futureDate); // uninteresting tasks in users (invalid because far in future)
      await database.insertTasks(2, '2', today); // uninteresting tasks in foreign home (invalid because other home)
      await database.insertTasks(4, '1', today); // valid tasks in users home
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'OpenTasks',
        query: openTasksQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"openTasks":[{"id":"7","type":{"name":"name-1","points":1},"assignee":null},{"id":"8","type":{"name":"name-1","points":1},"assignee":null},{"id":"9","type":{"name":"name-1","points":1},"assignee":null},{"id":"10","type":{"name":"name-1","points":1},"assignee":null}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'OpenTasks query returns only tasks that are not assigned to a different roommate',
    async () => {
      const today = new Date();

      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks(3, undefined, today);
      await database.assignUserToTask('user-1', '1'); // interesting task that user is assigned to
      await database.assignUserToTask('user-2', '2'); // uninteresting task that roommate is assigned to
      await database.addUserToHome('user-1', '1');
      await database.addUserToHome('user-2', '1');

      const body = {
        operationName: 'OpenTasks',
        query: openTasksQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"openTasks":[{"id":"1","type":{"name":"name-1","points":1},"assignee":{"id":"user-1","picture":"picture-1"}},{"id":"3","type":{"name":"name-1","points":1},"assignee":null}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'OpenTasks query returns only tasks that have not been completed',
    async () => {
      const today = new Date();

      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks(3, undefined, today);
      await database.insertReceipt('user-1', '1');
      await database.insertReceipt('user-1', '2');
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'OpenTasks',
        query: openTasksQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"openTasks":[{"id":"3","type":{"name":"name-1","points":1},"assignee":null}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTask mutation returns created task',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'CreateTask mutation returns error if task type is invalid',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'DeleteTask mutation returns true when task is deleted',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'DeleteTask mutation returns error when task cannot be found',
    async () => {
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
        '{"errors":[{"message":"Could not find any entity of type \\"Task\\" matching: \\"foobar\\"","locations":[{"line":3,"column":7}],"path":["deleteTask"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"Task\\" matching: \\"foobar\\""}}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'AssignTask mutation returns task when user is assigned',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'AssignTask mutation returns task when roommate is assigned',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'AssignTask mutation returns error when assignee is not part of home',
    async () => {
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
    },
    timeoutLength
  );

  it(
    'AssignTask mutation returns error when task is not part of users home',
    async () => {
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
    },
    timeoutLength
  );

  const tasksQuery = `
    query Tasks {
      tasks {
        id
        date
        type {
          id
          name
          points
        }
        series {
          id
        }
        receipt {
          id
          name
        }
        assignee {
          id
          name
          picture
        }
      }
    }
  `;

  const openTasksQuery = `
    query OpenTasks {
      openTasks {
        id
        type {
          name
          points
        }
        assignee {
          id
          picture
        }
      }
    }
  `;

  const createTaskQuery = `
    mutation CreateTask($date: String!, $type: String!) {
      createTask(date: $date, type: $type) {
        id
        date
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
        id
        date
        assignee {
          id
          name
          picture
        }
      }
    }
  `;
});
