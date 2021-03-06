import React from 'react';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  inputBaseClasses,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useApolloClient } from '@apollo/client';
import {
  HomeDocument,
  useCreateHomeMutation,
  useHomeQuery,
  useJoinHomeMutation,
} from '../lib/graphql/operations/home.graphql';
import LoadingSpinner from '../components/LoadingSpinner';

const Join: NextPage = () => {
  const { t } = useTranslation('join');
  const { enqueueSnackbar } = useSnackbar();

  const apolloClient = useApolloClient();
  const { data } = useHomeQuery();
  const [joinHome, { loading: loadingJoin, error }] = useJoinHomeMutation();
  const [createHome, { loading: loadingCreate }] = useCreateHomeMutation();

  const [changed, setChanged] = React.useState(false);
  const [redirectPending, setRedirectPending] = React.useState(false);

  const router = useRouter();
  const code = (router.query?.code as string | undefined)?.toUpperCase();

  const CreateForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const nameValue = (
          document.getElementById('nameInput') as HTMLInputElement
        ).value;
        handleCreateHome(nameValue);
      }}
    >
      <Stack direction="row" spacing={2}>
        <TextField
          id="nameInput"
          required
          label={t('create-input-label')}
          disabled={loadingCreate || loadingJoin}
          size="small"
        />
        <LoadingButton
          loading={loadingCreate}
          disabled={loadingJoin}
          type="submit"
          sx={{ width: '9em' }}
        >
          {t('create-button')}
        </LoadingButton>
      </Stack>
      <Typography mt={1} variant="subtitle2">
        {t('default-types')}
      </Typography>
    </form>
  );

  const JoinForm = (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setChanged(false);
        const codeValue = (
          document.getElementById('codeInput') as HTMLInputElement
        ).value.toUpperCase();
        handleJoinHome(codeValue);
      }}
    >
      <Stack direction="row" spacing={2}>
        <TextField
          id="codeInput"
          required
          label={t('join-input-label')}
          disabled={loadingCreate || loadingJoin}
          error={error && !changed}
          onChange={() => setChanged(true)}
          size="small"
          sx={{
            [`& .${inputBaseClasses.input}`]: { textTransform: 'uppercase' },
          }}
        />
        <LoadingButton
          loading={loadingJoin}
          disabled={loadingCreate}
          type="submit"
          sx={{ width: '9em' }}
        >
          {t('join-button')}
        </LoadingButton>
      </Stack>
    </form>
  );

  const ConfirmDialog = (
    <Dialog open={Boolean(code)} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">{t('dialog-title', { code })}</DialogTitle>
      {data?.home && (
        <DialogContent>
          <DialogContentText color="warning.main">
            {t('warning')}
          </DialogContentText>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={() => router.push('/join')} disabled={loadingJoin}>
          {t('dialog-cancel')}
        </Button>
        <LoadingButton
          loading={loadingJoin}
          color={data?.home ? 'warning' : 'success'}
          onClick={() => handleJoinHome(code as string)}
        >
          {t('join-button')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );

  return redirectPending ? (
    <LoadingSpinner loading />
  ) : (
    <Container maxWidth="sm">
      <Stack spacing={2}>
        <Typography variant="h3">{t('title')}</Typography>
        {data?.home && (
          <Typography color="warning.main">{t('warning')}</Typography>
        )}
        <Typography fontWeight="bold">{t('create-text')}</Typography>
        {CreateForm}
        <Typography fontWeight="bold">{t('join-text')}</Typography>
        {JoinForm}
      </Stack>
      {ConfirmDialog}
    </Container>
  );

  async function handleCreateHome(name: string) {
    try {
      const { data } = await createHome({
        variables: { name, language: router.locale || 'en' },
        update(cache, { data }) {
          if (!data) return;
          setRedirectPending(true);
          cache.writeQuery({
            query: HomeDocument,
            data: { home: data.createHome },
          });
        },
      });
      enqueueSnackbar(t('create-success', { name: data?.createHome.name }), {
        variant: 'success',
      });
      await apolloClient.resetStore();
      router.push((router.query.returnTo as string) || '/overview');
    } catch (err) {
      enqueueSnackbar(t('create-error'), { variant: 'error' });
    }
  }

  async function handleJoinHome(code: string) {
    try {
      const { data } = await joinHome({
        variables: { code },
        update(cache, { data }) {
          if (!data) return;
          setRedirectPending(true);
          cache.writeQuery({
            query: HomeDocument,
            data: { home: data.joinHome },
          });
        },
      });
      enqueueSnackbar(t('join-success', { name: data?.joinHome.name }), {
        variant: 'success',
      });
      await apolloClient.resetStore();
      router.push((router.query.returnTo as string) || '/overview');
    } catch (err) {
      enqueueSnackbar(t('join-error', { code }), { variant: 'error' });
    }
  }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['join', 'common'])),
    },
  };
};

export default Join;
