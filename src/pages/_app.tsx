import { ApolloProvider } from '@apollo/client';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { GraphQLSchema } from 'graphql';
import { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { useApollo } from '../lib/graphql/apollo-client';
import schema from '../lib/graphql/schema';
import { createEmotionCache } from '../lib/mui/emotion';
import theme from '../styles/theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

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
  const apolloClient = useApollo(graphqlSchema, pageProps.initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Change title in _app.tsx</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Component {...pageProps} />
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider>
  );
};

export async function getStaticProps() {
  return {
    props: {
      graphqlSchema: schema,
    },
  };
}

export default MyApp;
