import React from 'react';
import { Grid } from '@mui/material';
import { GetStaticProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { useRoommatesQuery } from '../lib/graphql/operations/roommates.graphql';
import { BarSeries } from '@devexpress/dx-react-chart-material-ui';
import ChartCard from '../components/statistics-page/ChartCard';
import ProgressCard from '../components/statistics-page/ProgressCard';
import InlineDiamond from '../components/InlineDiamond';

const Statistics: NextPage = () => {
  const { t } = useTranslation('statistics');
  const { loading, data } = useRoommatesQuery();

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
    </Grid>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || '', ['statistics', 'common'])),
    },
  };
};

export default Statistics;
