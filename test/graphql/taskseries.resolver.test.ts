import { database, testGraphql, timeoutLength } from './testUtils';

describe('Task series resolver with', () => {
  beforeEach(database.reset, timeoutLength); // High timeoutLength for GitLab pipeline
  afterAll(database.shutdown);

  it(
    'CreateTaskSeries mutation returns created task series',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'CreateTaskSeries',
        query: createTaskSeriesQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          type: '1',
          interval: 2,
          iterations: 6,
        },
      };

      // mutation that creates task series
      let res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"createTaskSeries":{"id":"1"}}}\n'
      );

      // query that gets tasks
      res = await testGraphql(tasksQueryBody, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"tasks":[{"id":"1","date":"2022-01-01T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"2","date":"2022-01-15T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"3","date":"2022-01-29T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"4","date":"2022-02-12T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"5","date":"2022-02-26T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"6","date":"2022-03-12T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTaskSeries mutation returns error if argument interval is invalid',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'CreateTaskSeries',
        query: createTaskSeriesQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          type: '1',
          interval: 0,
          iterations: 6,
        },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to create task series! Check that arguments interval and iterations are greater than zero.","locations":[{"line":3,"column":7}],"path":["createTaskSeries"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'CreateTaskSeries mutation returns error if argument iterations is invalid',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'CreateTaskSeries',
        query: createTaskSeriesQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          type: '1',
          interval: 4,
          iterations: -2,
        },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to create task series! Check that arguments interval and iterations are greater than zero.","locations":[{"line":3,"column":7}],"path":["createTaskSeries"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'DeleteTaskSeries mutation returns true when task series is deleted',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTaskSeries(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'DeleteTaskSeries',
        query: deleteTaskSeriesQuery,
        variables: { series: '1' },
      };

      // mutation that deletes task series and all related tasks
      let res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"deleteTaskSeries":{"id":"1"}}}\n'
      );

      // query that returns tasks
      res = await testGraphql(tasksQueryBody, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(1, '{"data":{"tasks":[]}}\n');
    },
    timeoutLength
  );

  it(
    'DeleteTaskSeries mutation returns error when task series cannot be found',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTaskSeries(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'DeleteTaskSeries',
        query: deleteTaskSeriesQuery,
        variables: { series: 'foobar' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Could not find any entity of type \\"TaskSeries\\" matching: \\"foobar\\"","locations":[{"line":3,"column":7}],"path":["deleteTaskSeries"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"TaskSeries\\" matching: \\"foobar\\""}}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'DeleteTaskSeriesSubsection mutation returns true when subsection of task series is deleted',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTaskSeries(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'DeleteTaskSeriesSubsection',
        query: deleteTaskSeriesSubsectionQuery,
        variables: { series: '1', start: '3' },
      };

      // mutation that deletes task series and related tasks
      let res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"deleteTaskSeriesSubsection":{"id":"1"}}}\n'
      );

      // query that returns task
      res = await testGraphql(tasksQueryBody, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"tasks":[{"id":"1","date":"2022-01-01T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}},{"id":"2","date":"2022-01-08T00:00:00.000Z","type":{"id":"1","name":"name-1","points":1},"series":{"id":"1"}}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'DeleteTaskSeriesSubsection mutation returns error when task series cannot be found',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTaskSeries(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'DeleteTaskSeriesSubsection',
        query: deleteTaskSeriesSubsectionQuery,
        variables: { series: 'foobar', start: '1' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Could not find any entity of type \\"TaskSeries\\" matching: \\"foobar\\"","locations":[{"line":3,"column":7}],"path":["deleteTaskSeriesSubsection"],"extensions":{"code":"INTERNAL_SERVER_ERROR","exception":{"message":"Could not find any entity of type \\"TaskSeries\\" matching: \\"foobar\\""}}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'DeleteTaskSeriesSubsection mutation returns error when starting task is not part of task series',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes(1);
      await database.insertTasks();
      await database.insertTaskSeries(1);
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'DeleteTaskSeriesSubsection',
        query: deleteTaskSeriesSubsectionQuery,
        variables: { series: '1', start: '1' },
      };

      const res = await testGraphql(body, 'user-1');

      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Failed to remove tasks from series! Start task is not part of task series.","locations":[{"line":3,"column":7}],"path":["deleteTaskSeriesSubsection"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  const createTaskSeriesQuery = `
    mutation CreateTaskSeries($start: Float!, $interval: Float!, $iterations: Float!, $type: String!) {
      createTaskSeries(start: $start, interval: $interval, iterations: $iterations, type: $type) {
        id
      }
    }
  `;

  const deleteTaskSeriesQuery = `
    mutation DeleteTaskSeries($series: String!) {
      deleteTaskSeries(series: $series) {
        id
      }
    }
  `;

  const deleteTaskSeriesSubsectionQuery = `
    mutation DeleteTaskSeriesSubsection($series: String!, $start: String!) {
      deleteTaskSeriesSubsection(series: $series, start: $start) {
        id
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
          series {
            id
          }
        }
      }
    `,
    variables: {},
  };
});
