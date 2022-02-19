import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import { render } from './testUtils';
import History from '../../src/pages/history';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query History {
      home {
        id
        history {
          id
          user {
            id
            name
            picture
          }
          date
          type
          taskType {
            id
            name
          }
          task {
            id
            date
            type {
              id
              name
            }
          }
          affectedUser {
            id
            name
          }
          extraInfo
        }
      }
    }
  `,
  data: {
    home: {
      id: '1',
      history: [
        {
          id: '1',
          user: { id: '1', name: 'User 1', picture: 'Picture 1' },
          date: '2022-01-10T11:59:59',
          type: 'home_created',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '2',
          user: { id: '1', name: 'User 1', picture: 'Picture 1' },
          date: '2022-01-10T11:59:58',
          type: 'home_renamed',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: 'New name',
        },
        {
          id: '3',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T11:59:00',
          type: 'user_join',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '4',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T11:58:00',
          type: 'user_leave',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '5',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T11:00:00',
          type: 'user_rename',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: 'New name',
        },
        {
          id: '6',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T10:00:00',
          type: 'task_type_created',
          taskType: { id: '1', name: 'Task type' },
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '7',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-09T12:00:00',
          type: 'task_series_created',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '8',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-08T12:00:00',
          type: 'task_series_deleted',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '9',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2021-12-10T12:00:00',
          type: 'task_series_sub_deleted',
          taskType: null,
          task: null,
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '10',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2021-11-10T12:00:00',
          type: 'task_created',
          taskType: null,
          task: {
            id: '1',
            date: new Date('2022-01-01'),
            type: { id: '1', name: 'Task type' },
          },
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '11',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2021-01-10T12:00:00',
          type: 'task_deleted',
          taskType: null,
          task: {
            id: '1',
            date: new Date('2022-01-01'),
            type: { id: '1', name: 'Task type' },
          },
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '12',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2020-01-10T12:00:00',
          type: 'task_completed',
          taskType: null,
          task: {
            id: '1',
            date: new Date('2022-01-01'),
            type: { id: '1', name: 'Task type' },
          },
          affectedUser: null,
          extraInfo: null,
        },
        {
          id: '13',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T12:00:00',
          type: 'task_assigned',
          taskType: null,
          task: {
            id: '1',
            date: new Date('2022-01-01'),
            type: { id: '1', name: 'Task type' },
          },
          affectedUser: { id: '1', name: 'User 1' },
          extraInfo: null,
        },
        {
          id: '14',
          user: { id: '2', name: 'User 2', picture: 'Picture 2' },
          date: '2022-01-10T12:00:00',
          type: 'task_unassigned',
          taskType: null,
          task: {
            id: '1',
            date: new Date('2022-01-01'),
            type: { id: '1', name: 'Task type' },
          },
          affectedUser: { id: '1', name: 'User 1' },
          extraInfo: null,
        },
      ],
    },
  },
});

describe('History page', () => {
  Date.now = jest.fn(() => new Date('2022-01-10T12:00:00').getTime());

  it('matches snapshot', async () => {
    const { asFragment } = await render(<History />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<History />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });
});
