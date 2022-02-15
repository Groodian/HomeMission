import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export,
} from 'devextreme-react/pie-chart';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

export const areas = [
  {
    activity: 'Clean',
    area: 12,
  },
  {
    activity: 'Building',
    area: 7,
  },
  {
    activity: 'Purchases',
    area: 7,
  },
  {
    activity: 'Bills payment',
    area: 7,
  },
  {
    activity: 'Others',
    area: 55,
  },
];

const ActivityPieChart = () => {
  return (
    <Card sx={{ height: '500px' }}>
      <CardHeader
        sx={{ fontSize: 18, color: '#1976d2' }}
        title="Activity type pie chart"
      />
      <Divider />
      <CardContent>
        <PieChart
          id="pie"
          dataSource={areas}
          palette="Bright"
          title="Completed Activities"
        >
          <Series argumentField="activity" valueField="area">
            <Label visible={true}>
              <Connector visible={true} width={1} />
            </Label>
          </Series>

          <Size width={500} />
          <Export enabled={true} />
        </PieChart>
      </CardContent>
    </Card>
  );
};

export default ActivityPieChart;
