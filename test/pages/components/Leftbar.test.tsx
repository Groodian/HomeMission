import React from 'react';
import { gql, InMemoryCache } from '@apollo/client';
import { fireEvent, screen } from '@testing-library/react';
import singletonRouter from 'next/router';
import Leftbar from '../../../src/components/Leftbar/Leftbar';
import { render } from '../testUtils';

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
  data: {
    home: {
      __typename: 'Home',
      id: '1',
      name: 'Home',
      code: 'ABCDEF',
      users: [
        {
          __typename: 'User',
          id: '1',
          name: 'Name',
          picture: 'Picture',
        },
      ],
    },
  },
});

describe('Leftbar', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Leftbar />, { apolloCache });
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Leftbar />, {
      language: 'de',
      apolloCache,
    });
    expect(asFragment()).toMatchSnapshot();
  });

  it('links to overview page', async () => {
    const { getByText } = await render(<Leftbar />, { apolloCache });
    fireEvent.click(getByText('Overview'));
    expect(singletonRouter).toMatchObject({ asPath: 'overview' });
  });

  it('links to statistics page', async () => {
    const { getByText } = await render(<Leftbar />, { apolloCache });
    fireEvent.click(getByText('Statistics'));
    expect(singletonRouter).toMatchObject({ asPath: 'statistics' });
  });

  it('links to history page', async () => {
    const { getByText } = await render(<Leftbar />, { apolloCache });
    fireEvent.click(getByText('Activity history'));
    expect(singletonRouter).toMatchObject({ asPath: 'history' });
  });

  it('shows invite dialog', async () => {
    const { getByText } = await render(<Leftbar />, { apolloCache });
    fireEvent.click(getByText('Invite others'));
    expect(screen.getByText('Invite roommates')).toBeTruthy();
  });

  it('shows leave home dialog', async () => {
    const { getByText } = await render(<Leftbar />, { apolloCache });
    fireEvent.click(getByText('Leave home'));
    expect(
      screen.getByText('Are you sure you want to leave this home?')
    ).toBeTruthy();
  });
});
