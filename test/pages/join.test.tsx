import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import { render } from './testUtils';
import Join from '../../src/pages/join';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query Home {
      home {
        id
        name
        code
        users {
          id
          name
          picture
        }
      }
    }
  `,
  data: { home: null },
});

describe('Join page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Join />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Join />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('shows warning when already in home', async () => {
    apolloCache.writeQuery({
      query: gql`
        query Home {
          home {
            id
            name
            code
            users {
              id
              name
              picture
            }
          }
        }
      `,
      data: {
        home: {
          __typename: 'Home',
          id: '1',
          name: 'Home',
          code: 'ABCDEF',
          users: {
            __typename: 'User',
            id: '1',
            name: 'Name',
            picture: 'Picture',
          },
        },
      },
    });

    const { asFragment } = await render(<Join />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });
});
