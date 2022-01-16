import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useHistoryQuery } from '../lib/graphql/operations/history.graphql';
import Image from 'next/image';

const History: NextPage = () => {
  const { t } = useTranslation(['history', 'common']);
  const { loading, error, data } = useHistoryQuery();
  return (
    <>
      {loading && t('loading', { ns: 'common' })}
      {error && (
        <>
          {error.name}: {error.message}
        </>
      )}
      {data?.home && (
        <>
          <h1>{t('title')}</h1>
          {data?.home?.history.map((history) => (
            <>
              <Image
                src={history.user.picture}
                alt={t('profile-picture-alt', { history })}
                width={40}
                height={40}
              />
              <h2 key={history.id}>
                {history.user.name}: {history.type} at {history.date}
              </h2>
            </>
          ))}
        </>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'history',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default withPageAuthRequired(History);
