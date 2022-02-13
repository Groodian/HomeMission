import React from 'react';
import { Avatar, Badge, Box, IconButton, Tooltip } from '@mui/material';
import { AddTask } from '@mui/icons-material';
import StyledCalendar from './StyledCalendar';
import Task from '../../entities/task';
import {
  DateHeaderProps,
  EventPropGetter,
  EventProps,
  EventWrapperProps,
  momentLocalizer,
} from 'react-big-calendar';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/fr';
import 'moment/locale/de';
import 'moment/locale/en-gb';
import InlineDiamond from '../InlineDiamond';

export type CEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource: Task;
};

// is passed to calendar to render a user icon badge over calendar event if user is assigned
const CEventWrapperVisualize: React.FC<EventWrapperProps<CEvent>> = (props) => {
  const task = props.event.resource;
  const user = task.receipt?.completer || task.assignee;
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
const CEventVisualize: React.FC<EventProps<CEvent>> = (props) => {
  const event = props.event;
  return (
    <span>
      <strong>{event.resource.type?.name}</strong>
      {event.resource.type?.points && (
        <>
          : {event.resource.type?.points} <InlineDiamond />
        </>
      )}
    </span>
  );
};

// is passed to calendar to render calendar event container
const customEventPropGetter: EventPropGetter<CEvent> = (event) => {
  return {
    style: {
      backgroundColor: !event.resource.receipt ? 'grey' : 'green',
    },
  };
};

type TaskCalendarProps = {
  tasks?: Task[];
  onSelectTask?: (selectedTask: Task) => void;
  onAddTask?: (date: Date) => void;
};
const TaskCalendar: React.FC<TaskCalendarProps> = ({
  tasks,
  onSelectTask = () => undefined,
  onAddTask = () => undefined,
}) => {
  const { t } = useTranslation('overview', { keyPrefix: 'TaskCalendar' });
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  const events: CEvent[] = tasks
    ? tasks.map((task) => {
        return {
          title: task.type?.name + ': ' + task.type?.points,
          start: task.date,
          end: task.date,
          allDay: true,
          resource: task,
        };
      })
    : [];

  // is passed to calendar to render date cell header
  const CDateHeaderVisualize: React.FC<DateHeaderProps> = ({ date, label }) => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip title={t('add-task-tooltip') as string}>
          <IconButton
            size="small"
            onClick={() => onAddTask(date)}
            disabled={
              date.valueOf() < new Date().setDate(new Date().getDate() - 1) // past dates
            }
          >
            <AddTask fontSize="small" />
          </IconButton>
        </Tooltip>
        {label}
      </Box>
    );
  };

  return (
    <StyledCalendar
      localizer={localizer}
      events={events}
      culture={router.locale === 'de' ? 'de' : 'en-gb'}
      style={{ height: '75vh' }}
      views={['month']}
      eventPropGetter={customEventPropGetter}
      components={{
        event: CEventVisualize,
        eventWrapper: CEventWrapperVisualize,
        month: { dateHeader: CDateHeaderVisualize },
      }}
      messages={{
        next: t('next'),
        previous: t('previous'),
        today: t('today'),
        month: t('month'),
        week: t('week'),
        day: t('day'),
      }}
      onSelectEvent={(event) => onSelectTask(event.resource)}
    />
  );
};

export default TaskCalendar;
