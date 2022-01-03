import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { NextPage } from 'next';
import React from 'react';
import Copyright from '../components/Copyright';
import Link from '../components/Link';
import ProTip from '../components/ProTip';

const Home: NextPage = () => (
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
      <Link href="/roommates" color="secondary">
        Go to the Roommates test page
      </Link>
      <Link href="/api/graphql" color="secondary">
        Go to the GraphQL playground (in development mode)
      </Link>
      <Link href="/auth0" color="secondary">
        Go to the Auth0 test page
      </Link>
      <Link href="/join" color="secondary">
        Join a home or create a new one
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
    </Box>
  </Container>
);

export default Home;
