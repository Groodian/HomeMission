import React from 'react';
import {
  Avatar,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { TFunction, useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextRouter, useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  HistoryQuery,
  useHistoryQuery,
} from '../lib/graphql/operations/history.graphql';

const History: NextPage = () => {
  const { t } = useTranslation(['history']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { loading, error, data } = useHistoryQuery();
  const [updates, setUpdates] = React.useState(0);

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  // Rerender interval
  React.useEffect(() => {
    const newest = data?.home?.history[0]?.date;
    // Only set rerender interval if there is a newest history entry
    if (newest) {
      const timeDifference = new Date().getTime() - new Date(newest).getTime();
      setTimeout(
        () => setUpdates(updates + 1),
        timeDifference < 60000 ? 1000 : 60000 // Rerender every second or minute based on time difference to newest history entry
      );
    }
  }, [data, updates]);

  return (
    <TableContainer component={Paper}>
      <LoadingSpinner loading={loading} />
      <Table>
        <TableHead
          sx={{
            background: ({ palette }) =>
              palette.grey[palette.mode === 'light' ? 300 : 800],
          }}
        >
          <TableRow>
            <TableCell>
              <b>{t('roommate')}</b>
            </TableCell>
            <TableCell>
              <b>{t('activity')}</b>
            </TableCell>
            <TableCell>
              <b>{t('time')}</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.home?.history.map((history) => (
            <TableRow key={history.id}>
              <TableCell>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: 'center' }}
                >
                  <Avatar
                    src={history.user.picture}
                    alt={t('profile-picture-alt', { history })}
                  />
                  <Typography>{history.user.name}</Typography>
                </Stack>
              </TableCell>
              <TableCell>{formatText(history, t, router)}</TableCell>
              <TableCell>
                <Tooltip
                  placement="bottom-start"
                  title={new Date(history.date).toLocaleString(router.locale)}
                >
                  <p>{t('ago', { time: formatTime(history.date, t) })}</p>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

type HistoryEntry = NonNullable<HistoryQuery['home']>['history'][number];

function formatText(
  history: HistoryEntry,
  t: TFunction,
  router: NextRouter
): string {
  let date = '';
  if (history.task) {
    date = new Date(history.task.date).toLocaleDateString(router.locale);
  }

  return t((history.type as string).replaceAll('_', '-').toLowerCase(), {
    history,
    date,
  });
}

function formatTime(date: string, t: TFunction): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000;
  if (interval >= 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('year', { ns: 'common' });
    } else {
      return interval + ' ' + t('years', { ns: 'common' });
    }
  }

  interval = seconds / 2592000;
  if (interval >= 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('month', { ns: 'common' });
    } else {
      return interval + ' ' + t('months', { ns: 'common' });
    }
  }

  interval = seconds / 86400;
  if (interval >= 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('day', { ns: 'common' });
    } else {
      return interval + ' ' + t('days', { ns: 'common' });
    }
  }

  interval = seconds / 3600;
  if (interval >= 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('hour', { ns: 'common' });
    } else {
      return interval + ' ' + t('hours', { ns: 'common' });
    }
  }

  interval = seconds / 60;
  if (interval >= 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('minute', { ns: 'common' });
    } else {
      return interval + ' ' + t('minutes', { ns: 'common' });
    }
  }

  interval = Math.floor(seconds);
  if (interval == 1) {
    return interval + ' ' + t('second', { ns: 'common' });
  } else {
    return interval + ' ' + t('seconds', { ns: 'common' });
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['history', 'common'])),
    },
  };
};

export default History;
