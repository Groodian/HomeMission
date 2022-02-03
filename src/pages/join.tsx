import { Button, Input } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router, { useRouter } from 'next/router';
import {
  HomeDocument,
  useCreateHomeMutation,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';

const Join: NextPage = () => {
  const { t } = useTranslation('join');
  const [useJoinHome] = useJoinHomeMutation();
  const [useCreateHome] = useCreateHomeMutation();
  const router = useRouter();

  // ... different handling for users who are already part of home

  // join home and redirect if query parameter 'code' is present
  if (router.query?.code) {
    joinHome(router.query.code as string);
  }

  function joinHome(code: string) {
    useJoinHome({
      variables: { code },
      update(cache, { data }) {
        if (!data) return;
        cache.writeQuery({
          query: HomeDocument,
          data: { home: data.joinHomeByCode },
        });
      },
    })
      .then(() => {
        // ... toast (success): joined home XYZ
        Router.push((router.query.returnTo as string) || '/');
      })
      .catch(() => {
        // ... toast (error): invalid invitation code
      });
  }

  function createHome() {
    useCreateHome({
      update(cache, { data }) {
        if (!data) return;
        cache.writeQuery({
          query: HomeDocument,
          data: { home: data.createHome },
        });
      },
    })
      .then(() => {
        // ... toast (success): created home
        Router.push((router.query.returnTo as string) || '/');
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
      ...(await serverSideTranslations(locale || '', [
        'join',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default Join;
