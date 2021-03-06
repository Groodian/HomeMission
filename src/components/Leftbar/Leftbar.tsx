import React from 'react';
import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  SxProps,
  Theme,
  useTheme,
} from '@mui/material';
import {
  BarChart,
  DateRange,
  GroupAdd,
  History,
  SvgIconComponent,
} from '@mui/icons-material';
import StyledDrawer from '../StyledDrawer';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import InviteDialog from '../InviteDialog';
import LeaveHome from './LeaveHome';

type Page = {
  url: string;
  text: string;
  icon: SvgIconComponent;
}[];

const drawerWidth = 220;
const openedMixin = (theme: Theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme) => ({
  width: `calc(${theme.spacing(7.5)} + 1px)`,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(7.5)} + 1px)`,
  },
});

const Leftbar = () => {
  const { t } = useTranslation('common', { keyPrefix: 'Leftbar' });
  const theme = useTheme();
  const router = useRouter();

  const pages: Page = [
    { url: 'overview', text: t('overview'), icon: DateRange },
    { url: 'statistics', text: t('statistics'), icon: BarChart },
    { url: 'history', text: t('activity'), icon: History },
  ];

  const [open, setOpen] = React.useState(false);
  const [inviteOpen, setInviteOpen] = React.useState(false);

  return (
    <StyledDrawer
      variant="permanent"
      open={open}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={
        {
          whiteSpace: 'nowrap',
          ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
          }),
          ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          }),
        } as SxProps<Theme>
      }
    >
      <Box>
        <List>
          {pages.map((page) => (
            <ListItem
              button
              key={page.url}
              onClick={() => router.push(page.url)}
            >
              <ListItemIcon>
                <SvgIcon component={page.icon} />
              </ListItemIcon>
              <ListItemText primary={page.text} />
            </ListItem>
          ))}
          <Divider />
          <ListItem button onClick={() => setInviteOpen(true)}>
            <ListItemIcon>
              <GroupAdd />
            </ListItemIcon>
            <ListItemText primary={t('invite')} />
          </ListItem>
          <InviteDialog
            open={inviteOpen}
            onClose={() => setInviteOpen(false)}
          />
          <LeaveHome />
        </List>
      </Box>
    </StyledDrawer>
  );
};

export default Leftbar;
