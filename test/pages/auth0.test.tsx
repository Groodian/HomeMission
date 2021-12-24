import { UserProfile } from '@auth0/nextjs-auth0';
import React from 'react';
import Auth0Test from '../../src/pages/auth0';
import { render } from '../testUtils';

jest.mock('next/router', () => require('next-router-mock'));

const user: UserProfile = {
  name: 'Foo',
};

describe('Auth0 test page', () => {
  it('matches snapshot', () => {
    const { asFragment } = render(<Auth0Test />, { user });
    expect(asFragment()).toMatchSnapshot();
  });
});
