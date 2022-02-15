import { Grid } from '@mui/material';
import { NextPage } from 'next';
import BarChart from '../components/Charts/BarChart';
import { ProfileCard } from '../components/Cards/ProfileCard';
import { ProgressCard } from '../components/Cards/ProgressCard';
import ActivityPieChart from '../components/Charts/ActivityPieChart';
import { AccountCard } from '../components/Cards/AccountCard';

const Statistics: NextPage = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <AccountCard />
      </Grid>
      <Grid item xs={8}>
        <ProfileCard />
      </Grid>
      <Grid item md={3} xs={6}>
        <ProgressCard />
      </Grid>
      <Grid item md={3} xs={6}>
        <ProgressCard />
      </Grid>
      <Grid item md={3} xs={6}>
        <ProgressCard />
      </Grid>
      <Grid item md={3} xs={6}>
        <ProgressCard />
      </Grid>
      <Grid item xs={12} md={6}>
        <BarChart />
      </Grid>
      <Grid item xs={12} md={6}>
        <ActivityPieChart />
      </Grid>
    </Grid>
  );
};

export default Statistics;
