import { Link } from '@mui/material'; // ! Don't use Next link for API
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUserQuery } from '../lib/graphql/operations/user.graphql';

const Auth0Test: NextPage = () => {
  const { t } = useTranslation(['auth0', 'common']);
  const { loading, error, data } = useUserQuery();

  if (loading) return <>{t('loading', { ns: 'common' })}</>;
  if (error)
    return (
      <>
        {error.name}: {error.message}
      </>
    );

  return (
    <>
      {data?.user ? (
        <>
          {t('greeting', { name: data.user.name }) +
            t('points', { count: data.user.points })}
          <Link href="/api/auth/logout">{t('logout')}</Link>
        </>
      ) : (
        <Link href="/api/auth/login">{t('login')}</Link>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['auth0', 'common'])),
    },
  };
};

export default Auth0Test;
