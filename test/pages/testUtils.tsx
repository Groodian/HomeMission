import { ApolloCache } from '@apollo/client';
import { MockedProvider } from '@apollo/client/testing';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { render, RenderOptions } from '@testing-library/react';
import { readdirSync } from 'fs';
import i18n from 'i18next';
import Backend from 'i18next-fs-backend';
import { join } from 'path';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import lightTheme from '../../src/styles/light-theme';

interface InitialState {
  apolloCache?: ApolloCache<any>;
  language?: 'en' | 'de';
}

// Get all namespaces
const ns = readdirSync(join(__dirname, '../../public/locales/en/')).map(
  (file) => file.slice(0, -5) // remove .json
);

// Initialize i18n
const initialized = i18n
  .use(initReactI18next)
  .use(Backend)
  .init({
    fallbackLng: 'en',
    ns,
    interpolation: {
      escapeValue: false, // Not needed for React
    },
    backend: {
      loadPath: join(__dirname, '../../public/locales/{{lng}}/{{ns}}.json'),
    },
  });

async function customRender(
  ui: JSX.Element,
  initialState?: InitialState,
  options: RenderOptions = {}
) {
  await initialized;
  await i18n.changeLanguage(initialState?.language || 'en');

  const Providers: React.FC = ({ children }) => (
    <I18nextProvider i18n={i18n}>
      <MockedProvider cache={initialState?.apolloCache}>
        <ThemeProvider theme={lightTheme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </MockedProvider>
    </I18nextProvider>
  );

  return render(ui, {
    wrapper: Providers,
    ...options,
  });
}

export function mockWindowLocationAssign() {
  delete (window as Partial<Window>).location;
  window.location = { assign: jest.fn() } as unknown as Location;
  return window.location.assign;
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { customRender as render };
