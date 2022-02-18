import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Switch,
  useTheme,
} from '@mui/material';
import {
  Animation,
  ArgumentScale,
  ValueScale,
} from '@devexpress/dx-react-chart';
import {
  ArgumentAxis,
  Chart,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';
import { scaleBand } from '@devexpress/dx-chart-core';

const labelComponent: React.FC<ArgumentAxis.LabelProps> = (props) => {
  const theme = useTheme();
  return (
    <ArgumentAxis.Label
      {...props}
      style={{ fill: theme.palette.text.primary }}
    />
  );
};

type ChartCardProps = {
  title: string | React.ReactNode;
  loading?: boolean;
  data?: any[];
  maxValue?: number;
  toggle?: boolean;
  onToggle?: (value: boolean) => void;
};
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  loading = false,
  data,
  maxValue,
  toggle,
  onToggle = () => undefined,
  children,
}) => (
  <Card>
    <CardHeader
      sx={{ fontSize: 20, color: 'primary.main', textAlign: 'center' }}
      title={
        <>
          {title}
          {toggle && (
            <Switch
              sx={{ float: 'right' }}
              onChange={(event, checked) => onToggle(checked)}
            />
          )}
        </>
      }
    />
    <Divider />
    <CardContent>
      {loading ? (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size="5rem" />
        </Box>
      ) : (
        data && (
          <Chart data={data} height={300}>
            <ArgumentAxis labelComponent={labelComponent} />
            <ArgumentScale factory={scaleBand} />
            <ValueAxis labelComponent={labelComponent} />
            <ValueScale
              modifyDomain={
                maxValue ? (domain) => [domain[0], maxValue] : undefined
              }
            />
            {children}
            <Animation />
          </Chart>
        )
      )}
    </CardContent>
  </Card>
);

export default ChartCard;
