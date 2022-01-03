import { NextPage } from 'next';
import { Button, Input } from '@mui/material';
import {
  useCreateHomeMutation,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';
import Router from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';

const Join: NextPage = () => {
  const [joinHome] = useJoinHomeMutation();
  const [createHome] = useCreateHomeMutation();

  // ... different handling for users who are already part of home

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

          joinHome({ variables: { code: codeValue } })
            .then(() => {
              // ... toast (success): joined home XYZ
              Router.push('/');
            })
            .catch(() => {
              // ... toast (error): invalid invitation code
            });
        }}
      >
        Join home
      </Button>
      <Button
        onClick={() => {
          createHome()
            .then(() => {
              // ... toast (success): created home
              Router.push('/');
            })
            .catch(() => {
              // ... toast (error): failed to create home
            });
        }}
      >
        Create new home
      </Button>
    </>
  );
};

export default withPageAuthRequired(Join);
