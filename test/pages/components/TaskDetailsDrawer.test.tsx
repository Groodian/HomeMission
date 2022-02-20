import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import { render } from '../testUtils';
import TaskDetailsDrawer from '../../../src/components/TaskDetailsDrawer';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query Task {
      task(task: "1") {
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
          completionDate
          completer {
            id
            name
            picture
          }
        }
        assignee {
          id
          name
          picture
        }
      }
    }
  `,
  data: {
    task: {
      __typename: 'Task',
      id: '1',
      date: new Date('2022-01-01'),
      type: {
        __typename: 'TaskType',
        id: '1',
        name: 'Vacuum',
        points: 40,
      },
      series: { __typename: 'TaskSeries', id: '1' },
      receipt: {
        __typename: 'TaskReceipt',
        id: '1',
        name: 'Vacuum',
        completionDate: new Date('2022-01-01'),
        completer: {
          __typename: 'User',
          id: '1',
          name: 'User 1',
          picture: 'Picture 1',
        },
      },
      assignee: null,
    },
  },
});

describe('TaskDetailsDrawer', () => {
  Date.now = jest.fn(() => new Date('2022-01-01T12:00:00').getTime());

  it('matches snapshot', async () => {
    const { asFragment } = await render(<TaskDetailsDrawer taskId="1" />, {
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<TaskDetailsDrawer taskId="1" />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with assignee', async () => {
    apolloCache.writeQuery({
      query: gql`
        query Task {
          task(task: "1") {
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
              completionDate
              completer {
                id
                name
                picture
              }
            }
            assignee {
              id
              name
              picture
            }
          }
        }
      `,
      data: {
        task: {
          __typename: 'Task',
          id: '1',
          date: new Date('2022-01-09'),
          type: {
            __typename: 'TaskType',
            id: '1',
            name: 'Vacuum',
            points: 40,
          },
          series: null,
          receipt: null,
          assignee: {
            __typename: 'User',
            id: '1',
            name: 'User 1',
            picture: 'Picture 1',
          },
        },
      },
    });

    const { asFragment } = await render(<TaskDetailsDrawer taskId="1" />, {
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
