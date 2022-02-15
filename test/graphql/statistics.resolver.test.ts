import { database, testGraphql, timeoutLength } from './testUtils';

/**
 * Legend:
 * - unknown: users who have left the home
 */

describe('Statistics resolvers with', () => {
  beforeEach(database.reset, timeoutLength); // High timeoutLength for GitLab pipeline
  afterAll(database.shutdown);

  it(
    'HomeStatistic query returns an error if the date range is invalid',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'HomeStatistic',
        query: homeStatisticQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2021-12-30').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Could not create statistic for home because start date must be before end date","locations":[{"line":3,"column":7}],"path":["homeStatistic"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'HomeStatistic query returns an array of blank data points when no tasks have been completed',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'HomeStatistic',
        query: homeStatisticQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"homeStatistic":{"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'HomeStatistic query returns an array of data points when a single user has completed tasks',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-1', '4', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '5', new Date('2022-01-06'));

      const body = {
        operationName: 'HomeStatistic',
        query: homeStatisticQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"homeStatistic":{"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":2,"pointsWeek":2},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":3},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":4},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":4},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":2}]}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'HomeStatistic query returns an array of data points when multiple users have completed tasks',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.addUserToHome('user-2', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-2', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-2', '4', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '5', new Date('2022-01-06'));

      const body = {
        operationName: 'HomeStatistic',
        query: homeStatisticQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"homeStatistic":{"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":2,"pointsWeek":2},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":3},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":4},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":4},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":2}]}}}\n'
      );
    },
    timeoutLength
  );

  it(
    'HomeStatistic query returns an array of data points when user and unknown have completed tasks',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-2', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-2', '4', new Date('2022-01-01'));
      await database.insertReceipt(null, '5', new Date('2022-01-06'));

      const body = {
        operationName: 'HomeStatistic',
        query: homeStatisticQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"homeStatistic":{"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":2,"pointsWeek":2},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":3},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":4},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":4},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":2}]}}}\n'
      );
    },
    timeoutLength
  );

  /** -------------------------------  */

  it(
    'UserStatistics query returns an error if the date range is invalid',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'UserStatistics',
        query: userStatisticsQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2021-12-30').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"errors":[{"message":"Could not create statistic for users because start date must be before end date","locations":[{"line":3,"column":7}],"path":["userStatistics"],"extensions":{"code":"INTERNAL_SERVER_ERROR"}}],"data":null}\n'
      );
    },
    timeoutLength
  );

  it(
    'UserStatistics query returns arrays of blank data points for user and unknown when no tasks have been completed',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.addUserToHome('user-1', '1');

      const body = {
        operationName: 'UserStatistics',
        query: userStatisticsQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"userStatistics":[{"user":{"id":"user-1"},"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]},{"user":null,"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'UserStatistics query returns an array of data points for user and an array of blank data points for unknown',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-1', '4', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '5', new Date('2022-01-06'));

      const body = {
        operationName: 'UserStatistics',
        query: userStatisticsQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"userStatistics":[{"user":{"id":"user-1"},"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":2,"pointsWeek":2},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":3},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":4},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":4},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":2}]},{"user":null,"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'UserStatistics query returns multiple arrays of data points when multiple users have completed tasks and an empty array of data points for unknown',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.addUserToHome('user-2', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-2', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-2', '4', new Date('2022-01-01'));
      await database.insertReceipt('user-1', '5', new Date('2022-01-06'));

      const body = {
        operationName: 'UserStatistics',
        query: userStatisticsQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"userStatistics":[{"user":{"id":"user-1"},"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":1,"pointsWeek":1},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":2},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":1}]},{"user":{"id":"user-2"},"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":1,"pointsWeek":1},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":2},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":1}]},{"user":null,"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":0},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]}]}}\n'
      );
    },
    timeoutLength
  );

  it(
    'UserStatistics query returns an array of data points for the user and an array of data points for unknown',
    async () => {
      await database.insertUsers();
      await database.insertHomes();
      await database.insertTaskTypes();
      await database.insertTasks(3, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-01'));
      await database.insertTasks(1, undefined, new Date('2022-01-06'));
      await database.addUserToHome('user-1', '1');
      await database.insertReceipt('user-1', '1', new Date('2022-01-01'));
      await database.insertReceipt('user-2', '2', new Date('2022-01-02'));
      await database.insertReceipt('user-2', '4', new Date('2022-01-01'));
      await database.insertReceipt(null, '5', new Date('2022-01-06'));

      const body = {
        operationName: 'UserStatistics',
        query: userStatisticsQuery,
        variables: {
          start: new Date('2022-01-01').valueOf(),
          end: new Date('2022-01-08').valueOf(),
        },
      };

      const res = await testGraphql(body, 'user-1');
      expect(res.end).toHaveBeenNthCalledWith(
        1,
        '{"data":{"userStatistics":[{"user":{"id":"user-1"},"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":1,"pointsWeek":1},{"date":"2022-01-02T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-06T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":1},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":0}]},{"user":null,"data":[{"date":"2022-01-01T00:00:00.000Z","pointsDay":1,"pointsWeek":1},{"date":"2022-01-02T00:00:00.000Z","pointsDay":1,"pointsWeek":2},{"date":"2022-01-03T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-04T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-05T00:00:00.000Z","pointsDay":0,"pointsWeek":2},{"date":"2022-01-06T00:00:00.000Z","pointsDay":1,"pointsWeek":3},{"date":"2022-01-07T00:00:00.000Z","pointsDay":0,"pointsWeek":3},{"date":"2022-01-08T00:00:00.000Z","pointsDay":0,"pointsWeek":2}]}]}}\n'
      );
    },
    timeoutLength
  );

  const homeStatisticQuery = `
    query HomeStatistic($start: Float!, $end: Float!) {
      homeStatistic(start: $start, end: $end) {
        data {
          date
          pointsDay
          pointsWeek
        }
      }
    }
  `;

  const userStatisticsQuery = `
    query UserStatistics($start: Float!, $end: Float!) {
      userStatistics(start: $start, end: $end) {
        user {
          id
        }
        data {
          date
          pointsDay
          pointsWeek
        }
      }
    }
  `;
});
