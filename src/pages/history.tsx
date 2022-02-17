import React from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { useSnackbar } from 'notistack';
import LoadingSpinner from '../components/LoadingSpinner';
import { useHistoryQuery } from '../lib/graphql/operations/history.graphql';

const History: NextPage = () => {
  const { t } = useTranslation(['history']);
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { loading, error, data } = useHistoryQuery();

  React.useEffect(() => {
    if (error) enqueueSnackbar(t('error-message'), { variant: 'error' });
  }, [error]);

  return (
    <Container maxWidth="sm">
      <LoadingSpinner loading={loading} />
      <Typography variant="h3">{t('title')}</Typography>
      <List>
        {data?.home?.history.map((history) => (
          <ListItem key={history.id}>
            <ListItemIcon>
              <Image
                src={history.user.picture}
                alt={t('profile-picture-alt', { history })}
                width={80}
                height={80}
              />
            </ListItemIcon>
            <List>
              <ListItem>
                <ListItemText>{history.user.name}</ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>{formatText(history, t)}</ListItemText>
              </ListItem>
            </List>
            <Tooltip
              placement="bottom-start"
              title={new Date(history.date).toLocaleString(router.locale)}
            >
              <ListItemText>
                {t('ago', { time: formatTime(history.date, t) })}
              </ListItemText>
            </Tooltip>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

const formatText = (history: any, t: any): string => {
  return t((history.type as string).replaceAll('_', '-').toLowerCase());
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
