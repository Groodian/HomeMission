import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import TaskCalendar from '../components/TaskCalendar';
import { Task } from '../entities';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';

const Overview: NextPage = () => {
  const { t } = useTranslation(['TaskCalendar']);
  const { error, data } = useTasksQuery();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <>
      {data && (
        <TaskCalendar
          tasks={data.tasks as Task[]}
          onSelectEvent={(_task) => {
            // ... handle event selection
          }}
          onSelectSlot={(_slotInfo) => {
            // ... handle slot selection
          }}
        />
      )}
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        'TaskCalendar',
        'common',
      ])),
    },
  };
};

export default Overview;
