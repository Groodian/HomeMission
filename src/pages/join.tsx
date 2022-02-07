import { Button, Input } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Router, { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import {
  HomeDocument,
  useCreateHomeMutation,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';

const Join: NextPage = () => {
  const { t } = useTranslation('join');
  const { enqueueSnackbar } = useSnackbar();
  const [useJoinHome] = useJoinHomeMutation();
  const [useCreateHome] = useCreateHomeMutation();
  const router = useRouter();

  // TODO: different handling for users who are already part of home

  // Join home and redirect if query parameter 'code' is present
  useEffect(() => {
    if (router.query?.code) {
      joinHome(router.query.code as string);
    }
  }, []);

  async function joinHome(code: string) {
    try {
      const { data } = await useJoinHome({
        variables: { code },
        update(cache, { data }) {
          if (!data) return;
          cache.writeQuery({
            query: HomeDocument,
            data: { home: data.joinHomeByCode },
          });
        },
      });
      enqueueSnackbar(t('join-success', { name: data?.joinHomeByCode.name }), {
        variant: 'success',
      });
      Router.push((router.query.returnTo as string) || '/overview');
    } catch (err) {
      enqueueSnackbar(t('join-error'), { variant: 'error' });
    }
  }

  async function createHome() {
    try {
      const { data } = await useCreateHome({
        update(cache, { data }) {
          if (!data) return;
          cache.writeQuery({
            query: HomeDocument,
            data: { home: data.createHome },
          });
        },
      });
      enqueueSnackbar(t('create-success', { name: data?.createHome.name }), {
        variant: 'success',
      });
      Router.push((router.query.returnTo as string) || '/overview');
    } catch (err) {
      enqueueSnackbar(t('create-error'), { variant: 'error' });
    }
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
      ...(await serverSideTranslations(locale || '', ['join', 'common'])),
    },
  };
};

export default Join;
