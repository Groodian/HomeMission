import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  useTheme,
} from '@mui/material';
import { Animation } from '@devexpress/dx-react-chart';
import {
  ArgumentAxis,
  Chart,
  ValueAxis,
} from '@devexpress/dx-react-chart-material-ui';

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
};
const ChartCard: React.FC<ChartCardProps> = ({
  title,
  loading = false,
  data,
  children,
}) => (
  <Card>
    <CardHeader
      sx={{ fontSize: 20, color: 'primary.main', textAlign: 'center' }}
      title={title}
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
            <ValueAxis labelComponent={labelComponent} />
            {children}
            <Animation />
          </Chart>
        )
      )}
    </CardContent>
  </Card>
);

export default ChartCard;
