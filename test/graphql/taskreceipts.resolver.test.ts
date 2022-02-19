import { database, testGraphql, timeoutLength } from './testUtils';

describe('Task receipts resolver with', () => {
  Date.now = jest.fn(() => new Date('2022-01-01T12:00:00').getTime());

  beforeEach(database.reset, timeoutLength); // High timeoutLength for GitLab pipeline
  afterAll(database.shutdown);

  it(
    'TaskReceipts query returns an empty array when there are no task receipts',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'Receipts',
        query: receiptsQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"receipts":[]}}\n');
    },
    timeoutLength
  );

  it(
    'TaskReceipts query returns task receipts',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks();
      await database.addUserToHome('user-1', '1');
      await database.addUserToHome('user-2', '1');
      await database.insertReceipt('user-1', '1');
      await database.insertReceipt('user-1', '2');
      await database.insertReceipt('user-2', '2');

      const body = {
        operationName: 'Receipts',
        query: receiptsQuery,
        variables: {},
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"receipts":[{"id":"1","points":1,"name":"name-1","completer":{"id":"user-1","name":"name-1"}},{"id":"2","points":1,"name":"name-1","completer":{"id":"user-1","name":"name-1"}},{"id":"3","points":1,"name":"name-1","completer":{"id":"user-2","name":"name-2"}}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTaskReceipt mutation returns error if task already has receipt',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks();
      await database.addUserToHome('user-1', '1');
      await database.insertReceipt('user-1', '1');

      const body = {
        operationName: 'CreateTaskReceipt',
        query: createTaskReceiptQuery,
        variables: { task: '1' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to complete task! Task already has a receipt with id 1.","locations":[{"line":3,"column":7}],"path":["createTaskReceipt"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTaskReceipt mutation returns error if task is further in the future than one week',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks(1, undefined, new Date('2022-01-09'));
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'CreateTaskReceipt',
        query: createTaskReceiptQuery,
        variables: { task: '1' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to complete task! Task is further in the future than one week.","locations":[{"line":3,"column":7}],"path":["createTaskReceipt"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTaskReceipt mutation returns created task receipt',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'CreateTaskReceipt',
        query: createTaskReceiptQuery,
        variables: { task: '1' },
      };

      // mutation that creates task receipt
      let res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"createTaskReceipt":{"id":"1","completer":{"id":"user-1","name":"name-1","picture":"picture-1"}}}}\n'
      );

      // query that gets tasks
      res = await testGraphql(tasksQueryBody, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"tasks":[{"id":"1","date":"2022-01-01T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"receipt":{"id":"1","points":1,"name":"name-1"}}]}}\n'
      );
    },
    timeoutLength
  );

  const receiptsQuery = `
    query Receipts {
      receipts {
        id
        points
        name
        completer {
          id
          name
        }
      }
    }
  `;

  const createTaskReceiptQuery = `
    mutation CreateTaskReceipt($task: String!) {
      createTaskReceipt(task: $task) {
        id
        completer {
          id
          name
          picture
        }
      }
    }
  `;

  const tasksQueryBody = {
    operationName: 'Tasks',
    query: `
      query Tasks {
        tasks {
          id
          date
          type {
            id
            name
            points
          }
          receipt {
            id
            points
            name
          }
        }
      }
    `,
    variables: {},
  };
});
