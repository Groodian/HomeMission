import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';
import TaskCalendar from '../components/TaskCalendar';
import { Task } from '../entities';

const Overview: NextPage = () => {
  const { error, data } = useTasksQuery();

  // alert of error when error from tasks query loads
  if (error) {
    // ... error toast
  }

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
        '_app',
        'TaskCalendar',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default withPageAuthRequired(Overview);
