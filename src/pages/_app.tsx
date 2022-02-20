import React, {
  createContext,
  createRef,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Box,
  Container,
  CssBaseline,
  useMediaQuery,
  ThemeProvider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import { ApolloProvider } from '@apollo/client';
import { UserProvider } from '@auth0/nextjs-auth0';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { GraphQLSchema } from 'graphql';
import { GetStaticProps } from 'next';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SnackbarProvider } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import Navbar from '../components/Navbar/Navbar';
import Leftbar from '../components/Leftbar/Leftbar';
import Rightbar from '../components/Rightbar/Rightbar';
import { useApollo } from '../lib/graphql/apollo-client';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';
import schema from '../lib/graphql/schema';
import { createEmotionCache } from '../lib/mui/emotion';
import darkTheme from '../styles/dark-theme';
import lightTheme from '../styles/light-theme';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type ColorModeContextType = {
  setMode: (mode: string) => void;
};
export const ColorModeContext = createContext<ColorModeContextType>({
  setMode: () => undefined,
});

type TaskDetailsContextType = {
  setSelectedTask: (taskId?: string) => void;
};
export const TaskDetailsContext = createContext<TaskDetailsContextType>({
  setSelectedTask: () => undefined,
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
  const { t } = useTranslation('common');
  const apolloClient = useApollo(graphqlSchema, pageProps.initialApolloState);

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

  const {
    loading: userLoading,
    error: userError,
    data: userData,
  } = useUserQuery({
    client: apolloClient,
  });
  const { loading: homeLoading, data: homeData } = useHomeQuery({
    client: apolloClient,
  });

  const notistackRef = createRef<SnackbarProvider>();
  useEffect(() => {
    if (userError)
      notistackRef.current?.enqueueSnackbar(t('user-error'), {
        variant: 'error',
      });
  }, [userError]);

  const router = useRouter();
  let loading = true;

  // Wait until data is loaded
  if (!userLoading && !homeLoading) {
    loading = false;

    if (!userData?.user) {
      // Redirect to welcome page if user is not signed in
      redirect('/');
    } else if (!homeData?.home) {
      // Redirect to join page if user has no home
      redirect('/join');
    }
  }

  const [selectedTask, setSelectedTask] = React.useState<string | undefined>(
    undefined
  );
  const taskDetailsContext = useMemo(() => ({ setSelectedTask }), []);

  return (
    <ApolloProvider client={apolloClient}>
      <UserProvider>
        <CacheProvider value={emotionCache}>
          <Head>
            <title>{t('title')}</title>
            <link rel="icon" href="/favicon.ico" />
            <meta
              name="viewport"
              content="initial-scale=1, width=device-width"
            />
          </Head>
          <ColorModeContext.Provider value={colorModeContext}>
            <TaskDetailsContext.Provider value={taskDetailsContext}>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={router.locale === 'de' ? deLocale : enLocale}
              >
                <ThemeProvider theme={theme}>
                  <SnackbarProvider ref={notistackRef}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    {loading ? ( // Only show loading spinner
                      <LoadingSpinner loading />
                    ) : userData?.user ? ( // Only show bars when user is signed in
                      <>
                        <Navbar />
                        <Box sx={{ display: 'flex' }}>
                          {homeData?.home && <Leftbar />}
                          <Container sx={{ flexShrink: 1, my: 3 }}>
                            <Component {...pageProps} />
                            <TaskDetailsDrawer
                              taskId={selectedTask}
                              onCloseDrawer={() => setSelectedTask(undefined)}
                            />
                          </Container>
                          {homeData?.home && <Rightbar />}
                        </Box>
                      </>
                    ) : (
                      <Component {...pageProps} />
                    )}
                  </SnackbarProvider>
                </ThemeProvider>
              </LocalizationProvider>
            </TaskDetailsContext.Provider>
          </ColorModeContext.Provider>
        </CacheProvider>
      </UserProvider>
    </ApolloProvider>
  );

  /**
   * Helper to only redirect to a new page.
   * Saves the initially requested path.
   * @param pathname The destination.
   */
  function redirect(pathname: string) {
    // Only redirect if target is different
    if (router.pathname !== pathname) {
      router.push({ pathname, query: { returnTo: router.asPath } });
      loading = true; // Wait until new page is loaded
    }
  }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      graphqlSchema: schema,
      ...(await serverSideTranslations(locale || '', ['common'])),
    },
  };
};

export default appWithTranslation(MyApp);
