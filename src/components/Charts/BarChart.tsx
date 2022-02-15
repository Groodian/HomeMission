import { Chart, BarSeries } from '@devexpress/dx-react-chart-material-ui';
import React from 'react';
import {
  ArgumentAxis,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { useRoommatesQuery } from '../../lib/graphql/operations/roommates.graphql';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

const BarChart = () => {
  const { loading, error, data } = useRoommatesQuery();
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Card sx={{ height: '500px' }}>
      <CardHeader
        sx={{ fontSize: 18, color: '#1976d2' }}
        title="Roommate point chart"
      />
      <Divider />
      <CardContent>
        <Chart data={data?.home?.users}>
          <ArgumentAxis />
          <ValueAxis />
          <BarSeries
            valueField="points"
            argumentField="name"
            name="My points"
            color="#ffaa66"
          />
        </Chart>
      </CardContent>
    </Card>
  );
};

export default BarChart;
