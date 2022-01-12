import { Button, Link as MuiLink } from '@mui/material';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Copyright from '../components/Copyright';
import Link from '../components/Link';
import ProTip from '../components/ProTip';

const Home: NextPage = () => {
  const { t } = useTranslation('index');

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
          {t('heading')}
        </Typography>
        <Link href="/about" color="secondary">
          {t('link-about')}
        </Link>
        <Link href="/roommates" color="secondary">
          {t('link-roommates')}
        </Link>
        {/* ! Don't use Next link for API */}
        <MuiLink href="/api/graphql" color="secondary">
          {t('link-playground')}
        </MuiLink>
        <Link href="/auth0" color="secondary">
          {t('link-auth0')}
        </Link>
        <Link href="/join" color="secondary">
          {t('link-join')}
        </Link>
        <Link href="/history" color="secondary">
          {t('link-history')}
        </Link>
        <Link locale="en" href="" color="secondary">
          EN
        </Link>
        <Link locale="de" href="" color="secondary">
          DE
        </Link>
        <ProTip />
        <Copyright />

        {/* Content from old index.tsx */}
        <Button variant="contained" onClick={() => window.alert(t('alert'))}>
          {t('test-button')}
        </Button>

        <a href="https://nextjs.org/docs">
          <h2>{t('link-documentation')} &rarr;</h2>
        </a>

        <a href="https://nextjs.org/learn">
          <h2>{t('link-learn')} &rarr;</h2>
        </a>

        <a href="https://github.com/vercel/next.js/tree/master/examples">
          <h2>{t('link-examples')} &rarr;</h2>
        </a>

        <a href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app">
          <h2>{t('link-deploy')} &rarr;</h2>
        </a>
      </Box>
    </Container>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'index',
        'Copyright',
        'ProTip',
        'Navbar',
      ])),
    },
  };
};

export default Home;
