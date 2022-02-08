import { useEffect, useState } from 'react';
import { Container } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { Container } from '@mui/material';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCalendar from '../components/TaskCalendar';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';
import { Task } from '../entities';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';

const Overview: NextPage = () => {
  const { t } = useTranslation(['TaskCalendar']);
  const { loading, error, data } = useTasksQuery();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);

  // check if selected task needs to be updated
  if (selectedTask && data) {
    // matching task is either same (potentially updated) selected task or undefined if it was deleted
    const matchingTask = data.tasks.filter(
      (t) => t.id === selectedTask.id
    )[0] as Task | undefined;

    // update selected task if something has changed
    if (matchingTask !== selectedTask) setSelectedTask(matchingTask);
  }

  useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <>
      <Container>
        <LoadingSpinner loading={loading} />
        <TaskDetailsDrawer
          task={selectedTask}
          onCloseDrawer={() => setSelectedTask(undefined)}
        />
        {data && (
          <TaskCalendar
            tasks={data.tasks as Task[]}
            onSelectEvent={(task) => {
              setSelectedTask(task);
            }}
            onSelectSlot={(_slotInfo) => {
              // ... handle slot selection
            }}
          />
        )}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['overview', 'common'])),
    },
  };
};

export default Overview;
