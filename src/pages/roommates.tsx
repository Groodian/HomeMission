import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useRoommatesQuery } from '../lib/graphql/operations/roommates.graphql';

const RoommatesTest: NextPage = () => {
  const { t } = useTranslation(['roommates', 'common']);
  const { loading, error, data } = useRoommatesQuery();

  return (
    <>
      {loading && t('loading', { ns: 'common' })}
      {error && (
        <>
          {error.name}: {error.message}
        </>
      )}
      {data?.home && (
        <table>
          <tbody>
            <tr>
              <th>{t('name')}</th>
              <th>{t('picture')}</th>
              <th>{t('points')}</th>
            </tr>
            {data.home.users.map((roommate) => (
              <tr key={roommate.id}>
                <td>{roommate.name}</td>
                <td>
                  <Image
                    src={roommate.picture}
                    alt={t('profile-picture-alt', { roommate })}
                    width={40}
                    height={40}
                  />
                </td>
                <td>{roommate.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'roommates',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default withPageAuthRequired(RoommatesTest);
