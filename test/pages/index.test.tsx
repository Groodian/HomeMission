import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import singletonRouter from 'next/router';
import Welcome from '../../src/pages';
import { fireEvent, mockWindowLocationAssign, render } from './testUtils';

jest.mock('next/router', () => require('next-router-mock'));

const apolloCache = new InMemoryCache();
apolloCache.writeQuery({
  query: gql`
    query Home {
      home {
        id
        name
        code
      }
    }
  `,
  data: { home: null },
});

describe('Welcome page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Welcome />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Welcome />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('button links to login', async () => {
    const assign = mockWindowLocationAssign();

    const { getByText } = await render(<Welcome />, { apolloCache });
    fireEvent.click(getByText('Get Started'));

    expect(assign).toHaveBeenCalledWith('/api/auth/login?returnTo=%2F');
  });

  it('button links to login with return value', async () => {
    const assign = mockWindowLocationAssign();
    singletonRouter.push({ pathname: '/', query: { returnTo: '/join' } });

    const { getByText } = await render(<Welcome />, { apolloCache });
    fireEvent.click(getByText('Get Started'));

    expect(assign).toHaveBeenCalledWith('/api/auth/login?returnTo=%2Fjoin');
  });

  it('redirects to overview page if user has home', async () => {
    apolloCache.writeQuery({
      query: gql`
        query Home {
          home {
            id
            name
            code
          }
        }
      `,
      data: {
        home: {
          __typename: 'Home',
          id: '1',
          name: 'Home',
          code: 'ABCDEF',
        },
      },
    });

    await render(<Welcome />, { apolloCache });
    expect(singletonRouter).toMatchObject({ asPath: '/overview' });
  });
});
