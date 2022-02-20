import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import Rightbar from '../../../src/components/Rightbar/Rightbar';
import { render } from '../testUtils';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query OpenTasks {
      openTasks {
        id
        date
        type {
          id
          name
          points
        }
        assignee {
          id
          picture
          name
        }
        series {
          id
        }
      }
    }
  `,
  data: {
    openTasks: [
      {
        __typename: 'Task',
        id: '1',
        date: '2022-01-01',
        type: {
          __typename: 'TaskType',
          id: '1',
          name: 'Vacuum',
          points: 40,
        },
        assignee: null,
        series: null,
      },
      {
        __typename: 'Task',
        id: '2',
        date: '2022-01-09',
        type: {
          __typename: 'TaskType',
          id: '2',
          name: 'Clean',
          points: 60,
        },
        assignee: {
          __typename: 'User',
          id: '1',
          picture: 'Picture',
          name: 'User Name',
        },
        series: {
          __typename: 'Series',
          id: '1',
        },
      },
    ],
  },
});

describe('Rightbar', () => {
  Date.now = jest.fn(() => new Date('2022-01-01T12:00:00').getTime());

  it('matches snapshot', async () => {
    const { asFragment } = await render(<Rightbar />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Rightbar />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows info if there are no open tasks', async () => {
    const apolloCache = new InMemoryCache();
    apolloCache.writeQuery({
      query: gql`
        query OpenTasks {
          openTasks {
            id
            date
            type {
              name
              points
            }
            assignee {
              picture
              name
            }
            series {
              id
            }
          }
        }
      `,
      data: { openTasks: [] },
    });

    const { getByText } = await render(<Rightbar />, { apolloCache });
    expect(getByText('You are all caught up!')).toBeTruthy();
  });
});
