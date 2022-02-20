import React from 'react';
import { Container } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import TaskCalendar from '../components/overview-page/TaskCalendar';
import {
  TasksQuery,
  useTasksQuery,
} from '../lib/graphql/operations/task.graphql';
import AddTaskDialog from '../components/overview-page/AddTaskDialog';
import TasksAtDateDialog from '../components/overview-page/TasksAtDateDialog';

const Overview: NextPage = () => {
  const { t } = useTranslation('overview');
  const { loading, error, data } = useTasksQuery();
  const { enqueueSnackbar } = useSnackbar();

  const [tasksAtDate, setTasksAtDate] = React.useState<
    TasksQuery['tasks'] | undefined
  >(undefined);
  const [newTaskDate, setNewTaskDate] = React.useState<Date | undefined>(
    undefined
  );

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <Container>
      <LoadingSpinner loading={loading} />
      {data && (
        <TaskCalendar
          tasks={data.tasks}
          onShowAllAtDate={(date) => {
            // find all tasks at the date
            const tasks = data.tasks.filter(
              (task) =>
                new Date(task.date).getTime() >= date.getTime() &&
                new Date(task.date).getTime() <
                  date.getTime() + 1 * 24 * 60 * 60 * 1000
            );
            // open tasks at date dialog
            setTasksAtDate(tasks);
          }}
          onAddTask={setNewTaskDate}
        />
      )}
      <TasksAtDateDialog
        tasksAtDate={tasksAtDate}
        onCloseDialog={() => setTasksAtDate(undefined)}
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
