import { gql, InMemoryCache } from '@apollo/client';
import React from 'react';
import Home from '../../src/pages/index';
import { fireEvent, render } from '../testUtils';

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

describe('Home page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Home />, apolloCache);
    expect(asFragment()).toMatchSnapshot();
  });

  it('clicking button triggers alert', () => {
    const { getByText } = render(<Home />, apolloCache);
    window.alert = jest.fn();
    fireEvent.click(getByText('Test Button'));
    expect(window.alert).toHaveBeenCalledWith('With typescript and Jest');
  });
});
