import React from 'react';
import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHistoryQuery } from '../lib/graphql/operations/history.graphql';
import { NextRouter, useRouter } from 'next/router';

const History: NextPage = () => {
  const { t } = useTranslation(['history']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { loading, error, data } = useHistoryQuery();

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <TableContainer component={Paper}>
      <Divider />
      <LoadingSpinner loading={loading} />
      <Table>
        <TableHead sx={{ background: '#a3c4e1' }}>
          <TableRow>
            <TableCell>
              <b>User Avatar</b>
            </TableCell>
            <TableCell>
              <b>User name</b>
            </TableCell>
            <TableCell>
              <b>Activity</b>
            </TableCell>
            <TableCell>
              <b>Date</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.home?.history.map((history) => (
            <TableRow key={history.id}>
              <TableCell>
                <Image
                  src={history.user.picture}
                  alt={t('profile-picture-alt', { history })}
                  width={40}
                  height={40}
                />
              </TableCell>

              <TableCell>{history.user.name}</TableCell>

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

const formatText = (history: any, t: any, router: NextRouter): string => {
  let date = '';
  if (history.task) {
    date = new Date(history.task.date).toLocaleDateString(router.locale);
  }

  return t((history.type as string).replaceAll('_', '-').toLowerCase(), {
    history,
    date,
  });
};

const formatTime = (date: any, t: any): string => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000
  );

  let interval = seconds / 31536000;
  if (interval > 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('year', { ns: 'common' });
    } else {
      return interval + ' ' + t('years', { ns: 'common' });
    }
  }

  interval = seconds / 2592000;
  if (interval > 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('month', { ns: 'common' });
    } else {
      return interval + ' ' + t('months', { ns: 'common' });
    }
  }

  interval = seconds / 86400;
  if (interval > 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('day', { ns: 'common' });
    } else {
      return interval + ' ' + t('days', { ns: 'common' });
    }
  }

  interval = seconds / 3600;
  if (interval > 1) {
    interval = Math.floor(interval);
    if (interval == 1) {
      return interval + ' ' + t('hour', { ns: 'common' });
    } else {
      return interval + ' ' + t('hours', { ns: 'common' });
    }
  }

  interval = seconds / 60;
  if (interval > 1) {
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
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['history', 'common'])),
    },
  };
};

export default History;
