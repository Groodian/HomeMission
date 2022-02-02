import { Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRouter } from 'next/router';
import homeMissionLogo from '../../public/home_mission_grey.png';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    background:
      'radial-gradient(circle at 3% 25%, rgba(0, 40, 83, 1) 0%, rgba(4, 12, 24, 1) 25%)',
    padding: '4rem 6rem',
  },
  headerContent: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginRight: '5rem',
  },
  title: {
    background: 'linear-gradient(89.97deg, #AE67FA 1.84%, #F49867 102.67%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontWeight: '800',
    fontSize: '62px',
    lineHeight: '75px',
  },
  welcomeText: {
    color: '#81AFDD',
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '27px',
    marginTop: '1.5rem',
  },
  getStartedButton: {
    background: '#FF4820',
    borderRadius: '5px 5px 5px 5px',
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '27px',
    cursor: 'pointer',
    outline: 'none',
    border: 'none',
    paddingLeft: '2rem',
    paddingRight: '2rem',
    marginTop: '2rem',
    textTransform: 'none',
    '&:hover': {
      background: '#FC6342',
    },
  },
  image: {
    flex: '1',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

const Welcome: NextPage = () => {
  const classes = useStyles();
  const router = useRouter();
  const { t } = useTranslation(['index', 'common']);

  return (
    <div className={classes.header}>
      <div className={classes.headerContent}>
        <h1 className={classes.title}>{t('title', { ns: 'common' })}</h1>
        <p className={classes.welcomeText}> {t('welcome-text')}</p>
        <Button
          className={classes.getStartedButton}
          onClick={() => router.push('/api/auth/login')}
        >
          {t('button')}
        </Button>
      </div>
      <div className={classes.image}>
        <Image
          alt={t('title', { ns: 'common' })}
          src={homeMissionLogo}
          width="340px"
          height="340px"
        />
      </div>
    </div>
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
