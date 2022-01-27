import { styled } from '@mui/material/styles';
import { Calendar, CalendarProps } from 'react-big-calendar';
import { darken, lighten } from '@mui/material';
import { StyledComponent } from '@mui/styles';
import { CEvent } from './TaskCalendar';

const StyledCalendar = styled(Calendar)(({ theme }) => ({
  '&& .rbc-today': {
    backgroundColor:
      theme.palette.mode === 'dark' && darken(theme.palette.primary.main, 0.6),
  },
  '&& .rbc-off-range-bg': {
    backgroundColor:
      theme.palette.mode === 'dark' &&
      darken(theme.palette.background.default, 0),
  },
  '& .rbc-day-bg': {
    backgroundColor:
      theme.palette.mode === 'dark' &&
      lighten(theme.palette.background.default, 0.12),
  },
  '& .rbc-btn-group': {
    backgroundColor:
      theme.palette.mode === 'dark' &&
      lighten(theme.palette.background.default, 0.15),
  },
  '& .rbc-toolbar button': {
    color: theme.palette.mode === 'dark' && 'white',
  },
  '&& .rbc-selected-cell': {
    backgroundColor:
      theme.palette.mode === 'dark' &&
      lighten(theme.palette.background.default, 0),
  },
})) as StyledComponent<CalendarProps<CEvent>>;

export default StyledCalendar;