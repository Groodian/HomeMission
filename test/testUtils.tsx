import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { UserProfile, UserProvider } from '@auth0/nextjs-auth0';
import { render, RenderOptions } from '@testing-library/react';

interface InitialState {
  apolloCache?: ApolloCache<any>;
  user?: UserProfile;
}

function customRender(
  ui: JSX.Element,
  initialState?: InitialState,
  options: RenderOptions = {}
) {
  const Providers: React.FC = ({ children }) => (
    <MockedProvider cache={initialState?.apolloCache}>
      <UserProvider user={initialState?.user}>{children}</UserProvider>
    </MockedProvider>
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
