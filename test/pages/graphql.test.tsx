import { gql, InMemoryCache } from '@apollo/client';
import React from 'react';
import GraphQLTest from '../../src/pages/graphql';
import { render } from '../testUtils';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query User {
      user {
        id
        name
        status
      }
    }
  `,
  data: {
    user: {
      __typename: 'User',
      id: 'Baa',
      name: 'Baa',
      status: 'Healthy',
    },
  },
});

describe('GraphQL test page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<GraphQLTest />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });
});
