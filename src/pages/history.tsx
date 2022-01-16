import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { useHistoryQuery } from '../lib/graphql/operations/history.graphql';

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
          <h1>Test</h1>
          {data?.home?.history.map((history) => (
            <h2 key={history.id}>{history}</h2>
          ))}
        </>
      )}
    </>
  );
};

export default History;
