import { gql, InMemoryCache } from '@apollo/client';
import React from 'react';
import Auth0Test from '../../src/pages/auth0';
import { render } from '../testUtils';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query User {
      user {
        id
        name
        picture
        points
        home {
          id
        }
      }
    }
  `,
  data: {
    user: {
      __typename: 'User',
      id: 'Baa',
      name: 'Baa',
      picture: '',
      points: 100,
      home: { id: 'Bee' },
    },
  },
});

describe('Auth0 test page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Auth0Test />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });
});
