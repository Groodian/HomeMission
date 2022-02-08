import React from 'react';
import { Avatar, Badge } from '@mui/material';
import StyledCalendar from './StyledCalendar';
import { Task } from '../entities';
import {
  EventProps,
  EventWrapperProps,
  momentLocalizer,
  SlotInfo,
} from 'react-big-calendar';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/en-gb';

export type CEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: Task;
};

// is passed to calendar to render a user icon badge over calendar event if user is assigned
const CEventWrapperVisualize: React.ComponentType<EventWrapperProps<CEvent>> = (
  props
) => {
  const user = props.event.resource.assignee;
  const avatar = user && (
    <Avatar sx={{ width: 24, height: 24 }} alt={user.name} src={user.picture} />
  );

  return (
    <Badge style={{ width: '100%' }} badgeContent={avatar}>
      <div style={{ width: '100%' }}>{props.children}</div>
    </Badge>
  );
};

// is passed to calendar to render calendar events
const CEventVisualize = (props: EventProps<CEvent>) => {
  const event = props.event;
  return (
    <span>
      <strong>{event.resource.type?.name}</strong>
      {event.resource.type?.points && ': ' + event.resource.type?.points + 'P'}
    </span>
  );
};

// is passed to calendar to render calendar event container
const customEventPropGetter = (event: CEvent) => {
  return {
    style: {
      backgroundColor: !event.resource.receipt ? 'grey' : 'green',
    },
  };
};

type TaskCalendarProps = {
  tasks?: Task[];
  onSelectEvent?: (selectedTask: Task) => void;
  onSelectSlot?: (info: SlotInfo) => void;
};
const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  onSelectEvent = () => undefined,
  onSelectSlot = () => undefined,
}) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskCalendar' });
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  const events: CEvent[] = tasks
    ? tasks.map((task) => {
        return {
          title: task.type?.name + ' - ' + task.type?.points + ' points',
          start: task.date,
          end: task.date,
          allDay: true,
          resource: task,
        };
      })
    : [];

  return (
    <StyledCalendar
      localizer={localizer}
      events={events}
      culture={router.locale === 'de' ? 'de' : 'en-gb'}
      style={{ height: '75vh' }}
      views={['month']}
      selectable={true}
      eventPropGetter={customEventPropGetter}
      components={{
        event: CEventVisualize,
        eventWrapper: CEventWrapperVisualize,
      }}
      messages={{
        next: t('next'),
        previous: t('previous'),
        today: t('today'),
        month: t('month'),
        week: t('week'),
        day: t('day'),
      }}
      onSelectEvent={(event) => onSelectEvent(event.resource)}
      onSelectSlot={(event) => {
        if (event.slots.length === 1) {
          // ... open task creation mask on date from event.start
          onSelectSlot(event);
        }
      }}
    />
  );
};

export default TaskCalendar;
