import React from 'react';
import Home from '../../src/pages/index';
import { fireEvent, render } from './testUtils';

jest.mock('next/router', () => require('next-router-mock'));

describe('Home page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Home />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Home />, { language: 'de' });
    expect(asFragment()).toMatchSnapshot();
  });

  it('clicking button triggers alert', async () => {
    const { getByText } = await render(<Home />);
    window.alert = jest.fn();
    fireEvent.click(getByText('Test Button'));
    expect(window.alert).toHaveBeenCalledWith('With typescript and Jest');
  });

  it('clicking button triggers alert DE', async () => {
    const { getByText } = await render(<Home />, { language: 'de' });
    window.alert = jest.fn();
    fireEvent.click(getByText('Test Button'));
    expect(window.alert).toHaveBeenCalledWith('Mit typescript und Jest');
  });
});
