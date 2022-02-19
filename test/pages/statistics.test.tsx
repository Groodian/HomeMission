import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import { render } from './testUtils';
import Statistics from '../../src/pages/statistics';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query Roommates {
      home {
        id
        users {
          id
          name
          picture
          points
        }
      }
    }
  `,
  data: {
    home: {
      id: '1',
      users: [
        { id: '1', name: 'User 1', picture: 'Picture 1', points: 50 },
        { id: '2', name: 'User 2', picture: 'Picture 2', points: 100 },
      ],
    },
  },
});
apolloCache.writeQuery({
  query: gql`
    query HomeStatistic {
      homeStatistic {
        data {
          date
          pointsDay
          pointsWeek
        }
        weeklyProgress
        monthlyProgress
      }
    }
  `,
  data: {
    homeStatistic: {
      data: [
        { date: '2022-01-01', pointsDay: 50, pointsWeek: 50 },
        { date: '2022-01-02', pointsDay: 30, pointsWeek: 80 },
      ],
      weeklyProgress: 75.4843,
      monthlyProgress: 13.8114,
    },
  },
});
apolloCache.writeQuery({
  query: gql`
    query UserStatistics {
      userStatistics {
        user {
          id
          name
          picture
        }
        data {
          date
          pointsDay
          pointsWeek
        }
      }
    }
  `,
  data: {
    userStatistics: [
      {
        user: { id: '1', name: 'User 1', picture: 'Picture 1' },
        data: [
          { date: '2022-01-01', pointsDay: 10, pointsWeek: 10 },
          { date: '2022-01-02', pointsDay: 0, pointsWeek: 10 },
        ],
      },
      {
        user: null,
        data: [
          { date: '2022-01-01', pointsDay: 40, pointsWeek: 40 },
          { date: '2022-01-02', pointsDay: 30, pointsWeek: 70 },
        ],
      },
    ],
  },
});

describe('Statistics page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Statistics />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Statistics />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
