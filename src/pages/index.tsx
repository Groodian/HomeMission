import React from 'react';
import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import homeMissionLogo from '../../public/home_mission_grey_notitle.png';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';

const Welcome: NextPage = () => {
  const { t } = useTranslation(['index', 'common']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { data } = useHomeQuery();

  React.useEffect(() => {
    if (router.query.returnTo)
      enqueueSnackbar(t('redirected'), { variant: 'info' });
  }, []);

  // Redirect to overview page if user has a home
  if (data?.home) {
    router.push('/overview');
    return <LoadingSpinner loading />;
  }

  return (
    <Box
      sx={{
        background:
          'radial-gradient(circle at 3% 25%, rgba(0, 40, 83, 1) 0%, rgba(4, 12, 24, 1) 50%)',
        height: '100vh',
      }}
    >
      <Container>
        <Grid container p={8}>
          <Grid item xs={8} sx={{ alignSelf: 'center' }}>
            <Typography
              variant="h2"
              sx={{
                background:
                  'linear-gradient(89.97deg, #AE67FA 1.84%, #F49867 102.67%)',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 800,
              }}
            >
              {t('title', { ns: 'common' })}
            </Typography>
            <Typography
              sx={{
                color: '#81AFDD',
                fontSize: 20,
                marginTop: '1.5rem',
              }}
            >
              {t('welcome-text')}
            </Typography>
            <Button
              sx={{
                background: '#FF4820',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: 20,
                paddingLeft: '2rem',
                paddingRight: '2rem',
                marginTop: '2rem',
                textTransform: 'none',
                '&:hover': {
                  background: '#FC6342',
                },
              }}
              variant="text"
              onClick={() => {
                const returnTo = encodeURIComponent(
                  (router.query.returnTo as string) || '/'
                );
                window.location.assign('/api/auth/login?returnTo=' + returnTo);
              }}
            >
              {t('button')}
            </Button>
          </Grid>
          <Grid item xs={4}>
            <Image
              alt={t('title', { ns: 'common' })}
              src={homeMissionLogo}
              width="280px"
              height="280px"
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['index', 'common'])),
    },
  };
};

export default Welcome;
