import { NextPage } from 'next';
import { Button, Input } from '@mui/material';
import {
  useCreateHomeMutation,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';
import Router, { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';

const Join: NextPage = () => {
  const [useJoinHome] = useJoinHomeMutation();
  const [useCreateHome] = useCreateHomeMutation();
  const router = useRouter();

  // ... different handling for users who are already part of home

  useEffect(() => {
    // join home and redirect if query parameter 'code' is present
    if (router.query?.code) {
      joinHome(router.query?.code as string);
    }
  }, []);

  function joinHome(code: string) {
    useJoinHome({ variables: { code: code } })
      .then(() => {
        // ... toast (success): joined home XYZ
        Router.push('/');
      })
      .catch(() => {
        // ... toast (error): invalid invitation code
      });
  }

  function createHome() {
    useCreateHome()
      .then(() => {
        // ... toast (success): created home
        Router.push('/');
      })
      .catch(() => {
        // ... toast (error): failed to create home
      });
  }

  return (
    <>
      <Input
        id={'codeInput'}
        type={'text'}
        placeholder={'Enter invitation code'}
      />
      <Button
        onClick={() => {
          const codeValue = (
            document.getElementById('codeInput') as HTMLInputElement
          ).value;
          joinHome(codeValue);
        }}
      >
        Join home
      </Button>
      <Button onClick={() => createHome()}>Create new home</Button>
    </>
  );
};

export default withPageAuthRequired(Join);
