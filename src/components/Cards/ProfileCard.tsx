import { Card, CardContent, CardHeader, Divider } from '@mui/material';

export const ProfileCard = () => {
  return (
    <Card sx={{ height: '250px' }}>
      <CardHeader title="Profile details" />
      <Divider />
      <CardContent>Informations</CardContent>
    </Card>
  );
};
