import { ApolloProvider } from '@apollo/client';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { useMediaQuery } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GraphQLSchema } from 'graphql';
import { GetStaticProps } from 'next';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React, { createContext, useMemo, useState } from 'react';
import Navbar from '../components/Navbar';
import { useApollo } from '../lib/graphql/apollo-client';
import schema from '../lib/graphql/schema';
import { createEmotionCache } from '../lib/mui/emotion';
import darkTheme from '../styles/dark-theme';
import lightTheme from '../styles/light-theme';
import Leftbar from "../components/Leftbar";
import Home from "./index";
import Grid from "@mui/material/Grid";
import {Feed} from "@mui/icons-material";
import Rightbar from "../components/Rightbar";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type ModeContextTypes = {
  setMode: (mode: string) => void;
};
export const ColorModeContext = createContext<ModeContextTypes>({
  setMode: () => undefined,
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

  const [mounted, setMounted] = useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
  });

  // Load initial color mode from local storage / user preference
  let initialColorMode = '';
  if (typeof window !== 'undefined') {
    initialColorMode = localStorage.getItem('colorMode') || '';
    if (!initialColorMode) {
      initialColorMode = prefersDarkMode ? 'dark' : 'light';
    }
  }
  const [colorMode, setColorMode] = useState<string>(initialColorMode);

  const colorModeContext = useMemo(
    () => ({
      setMode: (mode: string) => {
        localStorage.setItem('colorMode', mode);
        setColorMode(mode);
      },
    }),
    []
  );

  // Update the theme only if the mode changes
  const theme = useMemo(
    () => (colorMode === 'dark' ? darkTheme : lightTheme),
    [colorMode]
  );

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{t('title')}</title>
            <link rel="icon" href="favicon.svg" />
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ColorModeContext.Provider value={colorModeContext}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {
                // Prevent ssr flash
                mounted && (
                  <div>
                    <Navbar />
                    <Grid container>
                      <Grid item sm={2} xs={2}>
                        <Leftbar />
                      </Grid>
                      <Grid item sm={8} xs={10}>
                        <Component {...pageProps} />
                      </Grid>
                      <Grid item sm={2} >
                        <Rightbar />
                      </Grid>
                    </Grid>
                  </div>
                )
              }
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
