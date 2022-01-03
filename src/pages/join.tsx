import { GetStaticProps, NextPage } from 'next';
import { Button, Input } from '@mui/material';
import {
  useCreateHomeMutation,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';
import Router, { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

const Join: NextPage = () => {
  const { t } = useTranslation('join');
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
      <Input id="codeInput" type="text" placeholder={t('placeholder')} />
      <Button
        onClick={() => {
          const codeValue = (
            document.getElementById('codeInput') as HTMLInputElement
          ).value;
          joinHome(codeValue);
        }}
      >
        {t('join')}
      </Button>
      <Button onClick={() => createHome()}>{t('create')}</Button>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['_app', 'join'])),
    },
  };
};

export default withPageAuthRequired(Join);
