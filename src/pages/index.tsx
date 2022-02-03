import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import homeMissionLogo from '../../public/home_mission_grey.png';
import { useHomeQuery } from '../lib/graphql/operations/home.graphql';

const Welcome: NextPage = () => {
  const { t } = useTranslation(['index', 'common']);
  const router = useRouter();
  const { loading, data } = useHomeQuery();

  if (loading) {
    return null;
  }

  // Redirect to overview page if user has a home
  if (data?.home) {
    router.push('/overview');
    return null;
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
              component="h1"
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
              width="340px"
              height="340px"
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
      ...(await serverSideTranslations(locale || '', [
        'index',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default Welcome;
