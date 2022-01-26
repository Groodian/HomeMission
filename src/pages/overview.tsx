import { withPageAuthRequired } from '@auth0/nextjs-auth0';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTasksQuery } from '../lib/graphql/operations/task.graphql';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { useEffect, useState } from 'react';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

type CEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
};

const Overview: NextPage = () => {
  const { t } = useTranslation(['Overview']);
  const router = useRouter();

  const { error, data } = useTasksQuery();

  const [events, setEvents] = useState<CEvent[]>([]);

  const localizer = momentLocalizer(moment);

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
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture={router.locale === 'de' ? 'de' : 'en-gb'}
        style={{ height: 500 }}
        views={['month']}
        selectable={true}
        messages={{
          next: t('next'),
          previous: t('previous'),
          today: t('today'),
          month: t('month'),
          week: t('week'),
          day: t('day'),
        }}
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
        'Overview',
        'common',
        'Navbar',
      ])),
    },
  };
};

export default withPageAuthRequired(Overview);
