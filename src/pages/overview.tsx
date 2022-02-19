import React from 'react';
import { Container } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCalendar from '../components/overview-page/TaskCalendar';
import TaskDetailsDrawer from '../components/TaskDetailsDrawer';
import Task from '../entities/task';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';
import AddTaskDialog from '../components/overview-page/AddTaskDialog';

const Overview: NextPage = () => {
  const { t } = useTranslation('overview');
  const { loading, error, data } = useTasksQuery();
  const { enqueueSnackbar } = useSnackbar();

  const [selectedTask, setSelectedTask] = React.useState<Task | undefined>(
    undefined
  );
  const [newTaskDate, setNewTaskDate] = React.useState<Date | undefined>(
    undefined
  );

  // check if selected task needs to be updated
  if (selectedTask && data) {
    // matching task is either same (potentially updated) selected task or undefined if it was deleted
    const matchingTask = data.tasks.filter(
      (t) => t.id === selectedTask.id
    )[0] as Task | undefined;

    // update selected task if something has changed
    if (matchingTask !== selectedTask) setSelectedTask(matchingTask);
  }

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <Container>
      <LoadingSpinner loading={loading} />
      {data && (
        <TaskCalendar
          tasks={data.tasks as Task[]}
          onSelectTask={setSelectedTask}
          onAddTask={setNewTaskDate}
        />
      )}
      <TaskDetailsDrawer
        task={selectedTask}
        onCloseDrawer={() => setSelectedTask(undefined)}
      />
      <AddTaskDialog
        newTaskDate={newTaskDate}
        onCloseDialog={() => setNewTaskDate(undefined)}
      />
    </Container>
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
