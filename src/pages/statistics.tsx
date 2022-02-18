import React from 'react';
import { Grid } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRoommatesQuery } from '../lib/graphql/operations/roommates.graphql';
import {
  useHomeStatisticLazyQuery,
  useUserStatisticsLazyQuery,
} from '../lib/graphql/operations/statistic.graphql';
import { BarSeries } from '@devexpress/dx-react-chart-material-ui';
import ChartCard from '../components/statistics-page/ChartCard';
import ProgressCard from '../components/statistics-page/ProgressCard';
import InlineDiamond from '../components/InlineDiamond';
import { useRouter } from 'next/router';
import { LineSeries } from '@devexpress/dx-react-chart';
import { useSnackbar } from 'notistack';

const Statistics: NextPage = () => {
  const { t } = useTranslation('statistics');
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [maxPointsDay, setMaxPointsDay] = React.useState(100);
  const [maxPointsWeek, setMaxPointsWeek] = React.useState(100);
  const [homeWeekToggle, setHomeWeekToggle] = React.useState(false);
  const [userWeekToggles, setUserWeekToggles] = React.useState<boolean[]>([]);

  const { loading, data } = useRoommatesQuery();
  const [
    getHomeStatistic,
    {
      data: homeStatisticData,
      loading: homeStatisticLoading,
      error: homeStatisticError,
    },
  ] = useHomeStatisticLazyQuery();
  const [
    getUserStatistics,
    {
      data: userStatisticsData,
      loading: userStatisticsLoading,
      error: userStatisticsError,
    },
  ] = useUserStatisticsLazyQuery();

  React.useEffect(() => {
    const variables = {
      start: new Date().getTime() - 14 * 24 * 60 * 60 * 1000,
      end: new Date().getTime(),
    };
    getHomeStatistic({ variables: variables });
    getUserStatistics({ variables: variables });
  }, []);

  React.useEffect(() => {
    if (userStatisticsData) {
      const userStatistics = userStatisticsData.userStatistics;

      setUserWeekToggles(new Array(userStatistics.length).fill(false));

      let maxDay = 0; // most amount of points achieved in a day (everyone)
      let maxWeek = 0; // most amount of points achieved in a week (everyone)

      for (const userStatistic of userStatistics) {
        // map points into arrays
        const pointsDayArray = userStatistic.data.map((e) => e.pointsDay);
        const pointsWeekArray = userStatistic.data.map((e) => e.pointsWeek);

        // get most amount of points achieved by a user
        const maxDayLocal = Math.max(...pointsDayArray);
        const maxWeekLocal = Math.max(...pointsWeekArray);

        if (maxDayLocal > maxDay) maxDay = maxDayLocal;
        if (maxWeekLocal > maxWeek) maxWeek = maxWeekLocal;
      }

      setMaxPointsDay(maxDay);
      setMaxPointsWeek(maxWeek);
    }
  }, [userStatisticsData]);

  React.useEffect(() => {
    if (homeStatisticError)
      enqueueSnackbar(t('home-error-message'), { variant: 'error' });
  }, [homeStatisticError]);

  React.useEffect(() => {
    if (userStatisticsError)
      enqueueSnackbar(t('user-error-message'), { variant: 'error' });
  }, [userStatisticsError]);

  return (
    <Grid container spacing={2} sx={{ justifyContent: 'space-evenly' }}>
      <Grid item lg={4} xs={6}>
        <ProgressCard title={t('weekly-progress')} progress={75.5} />
      </Grid>
      <Grid item lg={4} xs={6}>
        <ProgressCard title={t('monthly-progress')} progress={46.941} />
      </Grid>
      <Grid item lg={6} xs={12}>
        <ChartCard
          title={
            <>
              <InlineDiamond /> {t('per-user')}
            </>
          }
          loading={loading}
          data={data?.home?.users}
        >
          <BarSeries argumentField="name" valueField="points" />
        </ChartCard>
      </Grid>

      {homeStatisticData && (
        <Grid item lg={6} xs={12}>
          <ChartCard
            title={
              <>
                {t('home')}: <InlineDiamond />{' '}
                {!homeWeekToggle ? t('per-day') : t('per-week')}
              </>
            }
            data={homeStatisticData.homeStatistic.data.map((dataPoint) => ({
              date: shortenDate(dataPoint.date),
              points: !homeWeekToggle
                ? dataPoint.pointsDay
                : dataPoint.pointsWeek,
            }))}
            loading={homeStatisticLoading}
            toggle={true}
            onToggle={(value) => setHomeWeekToggle(value)}
          >
            {!homeWeekToggle ? (
              <BarSeries argumentField="date" valueField="points" />
            ) : (
              <LineSeries argumentField="date" valueField="points" />
            )}
          </ChartCard>
        </Grid>
      )}

      {userStatisticsData &&
        userStatisticsData.userStatistics.map((userStatistic, index) => {
          const dayMode = !userWeekToggles[index];
          return (
            <Grid item lg={6} xs={12} key={userStatistic.user?.id}>
              <ChartCard
                title={
                  <>
                    {userStatistic.user
                      ? userStatistic.user.name
                      : t('ex-roommates')}
                    : <InlineDiamond /> {dayMode ? t('per-day') : t('per-week')}
                  </>
                }
                data={userStatistic.data.map((dataPoint) => ({
                  date: shortenDate(dataPoint.date),
                  points: dayMode ? dataPoint.pointsDay : dataPoint.pointsWeek,
                }))}
                loading={userStatisticsLoading}
                maxValue={dayMode ? maxPointsDay : maxPointsWeek}
                toggle={true}
                onToggle={(value) =>
                  setUserWeekToggles(
                    userWeekToggles.map((e, i) => (i !== index ? e : value))
                  )
                }
              >
                {dayMode ? (
                  <BarSeries argumentField="date" valueField="points" />
                ) : (
                  <LineSeries argumentField="date" valueField="points" />
                )}
              </ChartCard>
            </Grid>
          );
        })}
    </Grid>
  );

  function shortenDate(date: Date) {
    return new Date(date).toLocaleDateString(router.locale).slice(0, -5);
  }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['statistics', 'common'])),
    },
  };
};

export default Statistics;
