import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

type CEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};

const localize = momentLocalizer(moment);

const Overview: NextPage = () => {
  // const { t } = useTranslation(['overview', 'common']);
  const { error, data } = useTasksQuery();

  const [events, setEvents] = useState<CEvent[]>([]);

  // create calendar events when data from tasks query loads
  useEffect(() => {
    if (data) {
      setEvents(
        data.tasks.map((task) => {
          return {
            title: task.type.name + ' - ' + task.type.points + ' points',
            start: task.date,
            end: task.date,
            allDay: true,
            resource: task,
          };
        })
      );
    }
  }, [data]);

  // alert of error when error from tasks query loads
  useEffect(() => {
    if (error) {
      // ... error toast
    }
  }, [error]);

  return (
    <>
      <Calendar
        localizer={localize}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['month']}
        selectable={true}
        onSelectEvent={() => {
          // ... expand tile to offer deletion of task / series or complete task
        }}
        onSelectSlot={(event) => {
          if (event.slots.length === 1) {
            // ... open task creation mask on date from event.start
          }
        }}
      />
    </>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', [
        '_app',
        'overview',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default withPageAuthRequired(Overview);
