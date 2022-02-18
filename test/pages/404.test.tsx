import Custom404 from '../../src/pages/404';
import { render } from './testUtils';

jest.mock('next/router', () => require('next-router-mock'));

describe('404 page', () => {
  it('matches snapshot', async () => {
    const { asFragment } = await render(<Custom404 />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot DE', async () => {
    const { asFragment } = await render(<Custom404 />, { language: 'de' });
    expect(asFragment()).toMatchSnapshot();
  });
});
