import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const Signin: NextPage = () => {
  const { t } = useTranslation(['signin', 'common']);

  return (
    <>
      <h1>{t('welcome-text')}</h1>
      <h1>{t('welcome-text')}</h1>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['signin', 'common'])),
    },
  };
};

export default withPageAuthRequired(Signin);
