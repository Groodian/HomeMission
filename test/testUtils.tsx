import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { render, RenderOptions } from '@testing-library/react';

function customRender(
  ui: JSX.Element,
  apolloCache?: ApolloCache<any>,
  options: RenderOptions = {}
) {
  const Providers: React.FC = ({ children }) => (
    <MockedProvider cache={apolloCache}>{children}</MockedProvider>
  );

  return render(ui, {
    wrapper: Providers,
    ...options,
  });
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
