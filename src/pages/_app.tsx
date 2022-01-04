import { ApolloProvider } from '@apollo/client';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GraphQLSchema } from 'graphql';
import { GetStaticProps } from 'next';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { createContext, useEffect } from 'react';
import { useApollo } from '../lib/graphql/apollo-client';
import schema from '../lib/graphql/schema';
import { createEmotionCache } from '../lib/mui/emotion';
import darkTheme from '../styles/dark-theme';
import lightTheme from '../styles/light-theme';
import Navbar from '../components/Navbar';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type ModeContextTypes = {
  setMode: (mode: string) => void;
  getMode: () => string | null | undefined;
};
export const ColorModeContext = createContext<ModeContextTypes>({
  setMode: () => undefined,
  getMode: () => undefined,
});

interface MyAppProps extends AppProps {
  graphqlSchema: GraphQLSchema;
  emotionCache?: EmotionCache;
}

const MyApp: React.FC<MyAppProps> = ({
  Component,
  pageProps,
  graphqlSchema,
  emotionCache = clientSideEmotionCache,
}) => {
  const { t } = useTranslation('_app');
  const apolloClient = useApollo(graphqlSchema, pageProps.initialApolloState);

  const [darkMode, setDarkMode] = React.useState<boolean>(false);
  const colorMode = React.useMemo(
    () => ({
      setMode: (mode: string) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', mode);
          setDarkMode(mode === 'dark');
        }
      },
      getMode: () => {
        if (typeof window !== 'undefined') {
          return localStorage.getItem('theme');
        }
      },
    }),
    []
  );

  // set the saved theme on startup
  useEffect(() => {
    const initialTheme = localStorage.getItem('theme');
    if (!initialTheme) colorMode.setMode('dark');
    else {
      setDarkMode(initialTheme === 'dark');
    }
  }, []);

  // Update the theme only if the mode changes
  const theme = React.useMemo(
    () => (darkMode ? darkTheme : lightTheme),
    [darkMode]
  );

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{t('title')}</title>
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Navbar />
              <Component {...pageProps} />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </CacheProvider>
      </UserProvider>
    </ApolloProvider>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      graphqlSchema: schema,
      ...(await serverSideTranslations(locale || '', ['_app', 'Navbar'])),
    },
  };
};

export default appWithTranslation(MyApp);
