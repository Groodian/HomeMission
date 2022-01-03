import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, RenderOptions } from '@testing-library/react';
import lightTheme from '../src/styles/light-theme';

interface InitialState {
  apolloCache?: ApolloCache<any>;
}

function customRender(
  ui: JSX.Element,
  initialState?: InitialState,
  options: RenderOptions = {}
) {
  const Providers: React.FC = ({ children }) => (
    <MockedProvider cache={initialState?.apolloCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
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
