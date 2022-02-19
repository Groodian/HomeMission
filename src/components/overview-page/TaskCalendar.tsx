import React from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AddTask,
  ArrowBackIosNew,
  ArrowForwardIos,
  Today,
} from '@mui/icons-material';
import StyledCalendar from './StyledCalendar';
import Task from '../../entities/task';
import {
  DateHeaderProps,
  EventPropGetter,
  EventProps,
  EventWrapperProps,
  momentLocalizer,
  ToolbarProps,
} from 'react-big-calendar';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/de';
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
  moment.locale(router.locale);

  const events: CEvent[] = tasks
    ? tasks.map((task) => {
        return {
          title: task.type.name + ': ' + task.type.points,
          start: task.date,
          end: task.date,
          allDay: true,
          resource: task,
        };
      })
    : [];

  // is passed to calendar to render a custom toolbar
  const CToolbarVisualize: React.FC<ToolbarProps<CEvent, object>> = ({
    label,
    onNavigate,
  }) => {
    return (
      <Stack direction="row" spacing={3} mb={2}>
        <ButtonGroup>
          <Tooltip title={t('today') as string}>
            <Button onClick={() => onNavigate('TODAY')}>
              <Today />
            </Button>
          </Tooltip>
          <Tooltip title={t('previous') as string}>
            <Button onClick={() => onNavigate('PREV')}>
              <ArrowBackIosNew />
            </Button>
          </Tooltip>
          <Tooltip title={t('next') as string}>
            <Button onClick={() => onNavigate('NEXT')}>
              <ArrowForwardIos />
            </Button>
          </Tooltip>
        </ButtonGroup>
        <Typography variant="h4" component="span">
          {label}
        </Typography>
      </Stack>
    );
  };

  // is passed to calendar to render date cell header with create task button
  const CDateHeaderVisualize: React.FC<DateHeaderProps> = ({ date, label }) => {
    const today = new Date(Date.now());
    today.setHours(0, 0, 0, 0);
    const dateHasPassed = date < today;
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {dateHasPassed ? (
          <IconButton size="small" disabled={true}>
            <AddTask fontSize="small" />
          </IconButton>
        ) : (
          <Tooltip title={t('add-task-tooltip') as string}>
            <IconButton size="small" onClick={() => onAddTask(date)}>
              <AddTask fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {label}
      </Box>
    );
  };

  return (
    <StyledCalendar
      localizer={localizer}
      events={events}
      culture={router.locale}
      style={{ height: '75vh' }}
      views={['month']}
      eventPropGetter={customEventPropGetter}
      components={{
        toolbar: CToolbarVisualize,
        eventWrapper: CEventWrapperVisualize,
        event: CEventVisualize,
        month: { dateHeader: CDateHeaderVisualize },
      }}
      onSelectEvent={(event) => onSelectTask(event.resource)}
    />
  );
};

export default TaskCalendar;
