import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import React, { useState } from 'react';
import Copyright from '../components/Copyright';
import Link from '../components/Link';
import ProTip from '../components/ProTip';
import { initializeApollo } from '../lib/graphql/apollo-client';
import {
  UserDocument,
  useUpdateNameMutation,
  useUserQuery,
} from '../lib/graphql/operations/user.graphql';
import schema from '../lib/graphql/schema';

const Home: NextPage = () => {
  const { loading, error, data } = useUserQuery();
  const [newName, setNewName] = useState('');
  const [updateNameMutation] = useUpdateNameMutation();

  const onChangeName = () => {
    updateNameMutation({
      variables: {
        name: newName,
      },
    });
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          MUI v5 + Next.js with TypeScript example
        </Typography>
        <Link href="/about" color="secondary">
          Go to the about page
        </Link>
        <ProTip />
        <Copyright />

        {/* Content from old index.tsx */}
        <Button
          variant="contained"
          onClick={() => window.alert('With typescript and Jest')}
        >
          Test Button
        </Button>

        <a href="https://nextjs.org/docs">
          <h2>Documentation &rarr;</h2>
        </a>

        <a href="https://nextjs.org/learn">
          <h2>Learn &rarr;</h2>
        </a>

        <a href="https://github.com/vercel/next.js/tree/master/examples">
          <h2>Examples &rarr;</h2>
        </a>

        <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
          <h2>Deploy &rarr;</h2>
        </a>

        {/* GraphQL */}
        {loading && 'Loading...'}
        {error && 'Error: ' + error.message}
        {data && (
          <div>
            You&apos;re signed in as {data.user.name} and you&apos;re{' '}
            {data.user.status}.
            <div>
              <input
                type="text"
                placeholder="your new name..."
                onChange={(e) => setNewName(e.target.value)}
              />
              <input type="button" value="change" onClick={onChangeName} />
            </div>
          </div>
        )}
      </Box>
    </Container>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo(schema);

  await apolloClient.query({
    query: UserDocument,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Home;
