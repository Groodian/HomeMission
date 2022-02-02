import React from 'react';
import Welcome from '../../src/pages';
import { render } from './testUtils';

jest.mock('next/router', () => require('next-router-mock'));

describe('Welcome page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Welcome />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Welcome />, { language: 'de' });
    expect(asFragment()).toMatchSnapshot();
  });
});
